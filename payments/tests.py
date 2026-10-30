
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from orders.models import Order, OrderItem
from payments.models import Payment
from payments.services import (
    LateCaptureRefundService,
    PaymentExpirationService,
)
from products.models import Category, Product, ProductVariant
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
from rest_framework.test import APIRequestFactory, force_authenticate

from orders.views import CancelOrderAPIView
from unittest.mock import patch

from payments.models import Payment, WebhookEvent
from payments.views import (
    RazorpayWebhookAPIView,
    VerifyPaymentAPIView,
)

def create_test_image():
    image = Image.new("RGB", (10, 10), color="white")
    image_bytes = BytesIO()
    image.save(image_bytes, format="JPEG")
    image_bytes.seek(0)

    return SimpleUploadedFile(
        "test-category.jpg",
        image_bytes.read(),
        content_type="image/jpeg",
    )

class PaymentExpirationServiceTests(TestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User.objects.create_user(
            username="expiry_test_user",
            password="test-password-123",
        )

        self.category = Category.objects.create(
            name="Expiry Test Category",
            description="Test category",
            image=create_test_image(),
        )

        self.product = Product.objects.create(
            category=self.category,
            name="Expiry Test Product",
            description="Test product",
            price=Decimal("100.00"),
            stock=0,
        )

        self.variant = ProductVariant.objects.create(
            product=self.product,
            name="Expiry Test Variant",
            price=Decimal("100.00"),
            stock=0,
        )

        self.order = Order.objects.create(
            user=self.user,
            order_number="ORD-EXPIRY-TEST-001",
            total_amount=Decimal("300.00"),
            shipping_full_name="Test Customer",
            shipping_phone_number="9000000000",
            shipping_address_line_1="Test Street",
            shipping_address_line_2="",
            shipping_city="Kochi",
            shipping_state="Kerala",
            shipping_pincode="682001",
        )

        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            variant=self.variant,
            quantity=3,
            unit_price=Decimal("100.00"),
            subtotal=Decimal("300.00"),
        )

        self.payment = Payment.objects.create(
            order=self.order,
            amount=Decimal("300.00"),
            status=Payment.PaymentStatus.CREATED,
            expires_at=timezone.now() - timedelta(minutes=5),
        )

    def test_expired_payment_cancels_order_and_restores_stock_once(self):
        expired = PaymentExpirationService.expire_payment(
            self.payment.id
        )

        self.assertTrue(expired)

        self.variant.refresh_from_db()
        self.product.refresh_from_db()
        self.order.refresh_from_db()
        self.payment.refresh_from_db()

        self.assertEqual(self.variant.stock, 3)
        self.assertEqual(self.product.stock, 0)
        self.assertEqual(
            self.order.order_status,
            Order.OrderStatus.CANCELLED,
        )
        self.assertEqual(
            self.order.payment_status,
            Order.PaymentStatus.EXPIRED,
        )
        self.assertEqual(
            self.payment.status,
            Payment.PaymentStatus.EXPIRED,
        )

        # Processing the same expiry again must not restore stock twice.
        expired_again = PaymentExpirationService.expire_payment(
            self.payment.id
        )

        self.variant.refresh_from_db()

        self.assertFalse(expired_again)
        self.assertEqual(self.variant.stock, 3)


    def test_cancelling_unpaid_order_restores_stock_once(self):
        # Give the variant three units of reserved stock.
        self.variant.stock = 0
        self.variant.save(update_fields=["stock"])

        # This order has not been paid yet.
        self.order.order_status = Order.OrderStatus.PENDING
        self.order.payment_status = Order.PaymentStatus.PENDING
        self.order.save(
            update_fields=["order_status", "payment_status"]
        )

        factory = APIRequestFactory()
        request = factory.post(
            f"/api/orders/{self.order.id}/cancel/"
        )
        force_authenticate(request, user=self.user)

        response = CancelOrderAPIView.as_view()(
            request,
            pk=self.order.id,
        )

        self.assertEqual(response.status_code, 200)

        self.variant.refresh_from_db()
        self.order.refresh_from_db()

        self.assertEqual(self.variant.stock, 3)
        self.assertEqual(
            self.order.order_status,
            Order.OrderStatus.CANCELLED,
        )

        # A second cancellation should be rejected and must not
        # restore the same stock again.
        request = factory.post(
            f"/api/orders/{self.order.id}/cancel/"
        )
        force_authenticate(request, user=self.user)

        response = CancelOrderAPIView.as_view()(
            request,
            pk=self.order.id,
        )

        self.assertEqual(response.status_code, 400)

        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock, 3)


    @patch("orders.views.RazorpayService.refund_payment")
    def test_pending_refund_is_not_marked_as_completed(
        self,
        mock_refund_payment,
    ):
        # Arrange: this is a paid, confirmed order.
        self.payment.status = Payment.PaymentStatus.PAID
        self.payment.razorpay_payment_id = "pay_test_cancel_001"
        self.payment.save()

        self.order.order_status = Order.OrderStatus.CONFIRMED
        self.order.payment_status = Order.PaymentStatus.PAID
        self.order.save()

        # Razorpay accepted the refund, but it is still pending.
        mock_refund_payment.return_value = {
            "id": "rfnd_test_cancel_001",
            "status": "pending",
            "amount": 30000,
        }

        factory = APIRequestFactory()
        request = factory.post(
            f"/api/orders/{self.order.id}/cancel/"
        )
        force_authenticate(request, user=self.user)

        # Act
        response = CancelOrderAPIView.as_view()(
            request,
            pk=self.order.id,
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        self.payment.refresh_from_db()
        self.order.refresh_from_db()

        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.PROCESSING,
        )
        self.assertEqual(
            self.payment.razorpay_refund_id,
            "rfnd_test_cancel_001",
        )
        self.assertNotEqual(
            self.payment.status,
            Payment.PaymentStatus.REFUNDED,
        )


    @patch("orders.views.RazorpayService.refund_payment")
    def test_completed_refund_is_not_requested_again(
        self, mock_refund_payment
    ):
        self.payment.status = Payment.PaymentStatus.PAID
        self.payment.refund_status = Payment.RefundStatus.REFUNDED
        self.payment.razorpay_payment_id = "pay_test_cancel_002"
        self.payment.razorpay_refund_id = "rfnd_test_cancel_002"
        self.payment.save()

        self.order.order_status = Order.OrderStatus.CONFIRMED
        self.order.payment_status = Order.PaymentStatus.PAID
        self.order.save()

        factory = APIRequestFactory()
        request = factory.post(
            f"/api/orders/{self.order.id}/cancel/"
        )
        force_authenticate(request, user=self.user)

        response = CancelOrderAPIView.as_view()(
            request,
            pk=self.order.id,
        )

        mock_refund_payment.assert_not_called()

        self.assertNotEqual(
            self.payment.status,
            Payment.PaymentStatus.REFUNDED,
        )

        mock_refund_payment.assert_not_called()
        self.payment.refresh_from_db()
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.REFUNDED,
        )

    @patch("payments.views.RazorpayService.verify_payment")
    def test_payment_expiring_during_verification_is_not_finalized(
        self, mock_verify_payment
    ):
        # Start with a payment that has not expired yet.
        self.payment.razorpay_order_id = "order_test_expiry_race"
        self.payment.expires_at = timezone.now() + timedelta(minutes=5)
        self.payment.save(
            update_fields=["razorpay_order_id", "expires_at"]
        )

        # Simulate the deadline passing while Razorpay verification runs.
        def expire_during_verification(**kwargs):
            Payment.objects.filter(pk=self.payment.pk).update(
                expires_at=timezone.now() - timedelta(seconds=1)
            )

        mock_verify_payment.side_effect = expire_during_verification

        factory = APIRequestFactory()
        request = factory.post(
            "/api/payment/verify/",
            {
                "razorpay_order_id": "order_test_expiry_race",
                "razorpay_payment_id": "pay_test_expiry_race",
                "razorpay_signature": "valid-test-signature",
            },
            format="json",
        )
        force_authenticate(request, user=self.user)

        response = VerifyPaymentAPIView.as_view()(request)

        self.payment.refresh_from_db()
        self.order.refresh_from_db()

        # The finalization transaction must reject the expired payment.
        self.assertEqual(response.status_code, 400)
        self.assertNotEqual(
            self.payment.status, Payment.PaymentStatus.PAID
        )
        self.assertNotEqual(
            self.order.order_status, Order.OrderStatus.CONFIRMED
        )
        self.assertNotEqual(
            self.order.payment_status, Order.PaymentStatus.PAID
        )


class LateCapturedWebhookTests(PaymentExpirationServiceTests):

    @patch(
        "payments.views.LateCaptureRefundService.process_refund"
    )
    @patch(
        "payments.views.RazorpayService.verify_webhook_signature"
    )
    def test_late_captured_webhook_does_not_resurrect_expired_payment(
        self,
        mock_verify_signature,
        mock_process_refund,
    ):
        # Arrange: expire the payment first.
        expired = PaymentExpirationService.expire_payment(
            self.payment.id
        )
        self.assertTrue(expired)

        self.payment.refresh_from_db()
        self.order.refresh_from_db()
        self.variant.refresh_from_db()

        # Confirm the expiry process already cancelled the order
        # and restored its reserved stock.
        self.assertEqual(
            self.payment.status,
            Payment.PaymentStatus.EXPIRED,
        )
        self.assertEqual(
            self.order.order_status,
            Order.OrderStatus.CANCELLED,
        )
        self.assertEqual(self.variant.stock, 3)

        # Build a simulated Razorpay payment.captured event.
        payload = {
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_test_late_capture_001",
                        "order_id": "order_test_late_capture_001",
                        "amount": 30000,
                        "currency": "INR",
                        "status": "captured",
                    }
                }
            },
        }

        # Match the simulated Razorpay order ID to our local payment.
        self.payment.razorpay_order_id = (
            "order_test_late_capture_001"
        )
        self.payment.save(update_fields=["razorpay_order_id"])

        # Mock signature verification: no real Razorpay call or secret.
        mock_verify_signature.return_value = None

        factory = APIRequestFactory()
        request = factory.post(
            "/api/payment/webhook/",
            payload,
            format="json",
            HTTP_X_RAZORPAY_SIGNATURE="mock-signature",
            HTTP_X_RAZORPAY_EVENT_ID="evt_test_late_capture_001",
        )

        # Act: deliver the webhook and execute callbacks registered
        # with transaction.on_commit().
        with self.captureOnCommitCallbacks(execute=True):
            response = RazorpayWebhookAPIView.as_view()(request)


        # Assert: webhook acknowledges the event without resurrecting
        # the expired payment or cancelled order.
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["detail"],
            (
                "Late payment received. "
                "Refund processing has been scheduled."
            ),
        )

        mock_process_refund.assert_called_once_with(
            self.payment.id
        )

        self.payment.refresh_from_db()
        self.order.refresh_from_db()
        self.variant.refresh_from_db()
        self.product.refresh_from_db()

        self.assertEqual(
            self.payment.razorpay_payment_id,
            "pay_test_late_capture_001",
        )

        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.PENDING,
        )
        self.assertEqual(
            self.order.order_status,
            Order.OrderStatus.CANCELLED,
        )
        self.assertEqual(
            self.order.payment_status,
            Order.PaymentStatus.EXPIRED,
        )
        self.assertEqual(self.variant.stock, 3)
        self.assertEqual(self.product.stock, 0)

        # The event should be recorded exactly once.
        self.assertEqual(
            WebhookEvent.objects.filter(
                event_id="evt_test_late_capture_001"
            ).count(),
            1,
        )

        # Redelivery of the same event ID should be idempotent.
        request = factory.post(
            "/api/payment/webhook/",
            payload,
            format="json",
            HTTP_X_RAZORPAY_SIGNATURE="mock-signature",
            HTTP_X_RAZORPAY_EVENT_ID="evt_test_late_capture_001",
        )

        response = RazorpayWebhookAPIView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["detail"],
            "Webhook event already processed.",
        )
        mock_process_refund.assert_called_once_with(
            self.payment.id
        )
        self.variant.refresh_from_db()
        self.assertEqual(self.variant.stock, 3)
        self.assertEqual(
            WebhookEvent.objects.filter(
                event_id="evt_test_late_capture_001"
            ).count(),
            1,
        )



    def test_record_late_capture_marks_refund_pending(self):
        # Expire the payment and cancel the order first.
        PaymentExpirationService.expire_payment(
            self.payment.pk
        )

        self.payment.refresh_from_db()
        self.order.refresh_from_db()

        result = LateCaptureRefundService.record_late_capture(
            payment_id=self.payment.pk,
            razorpay_payment_id="pay_test_late_capture_002",
        )

        self.payment.refresh_from_db()
        self.order.refresh_from_db()

        self.assertTrue(result)
        self.assertEqual(
            self.payment.razorpay_payment_id,
            "pay_test_late_capture_002",
        )
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.PENDING,
        )
        self.assertEqual(
            self.payment.status,
            Payment.PaymentStatus.EXPIRED,
        )
        self.assertEqual(
            self.order.order_status,
            Order.OrderStatus.CANCELLED,
        )
        self.assertEqual(
            self.order.payment_status,
            Order.PaymentStatus.EXPIRED,
        )

        # Stock must not be restored a second time.
        self.variant.refresh_from_db()
        self.product.refresh_from_db()
        self.assertEqual(self.variant.stock, 3)
        self.assertEqual(self.product.stock, 0)

    def test_duplicate_late_capture_preserves_refund_state(self):
        PaymentExpirationService.expire_payment(
            self.payment.pk
        )

        payment_id = "pay_test_late_capture_003"

        LateCaptureRefundService.record_late_capture(
            payment_id=self.payment.pk,
            razorpay_payment_id=payment_id,
        )

        self.payment.refresh_from_db()
        self.payment.refund_status = Payment.RefundStatus.UNKNOWN
        self.payment.refund_error = "Previous refund outcome is uncertain."
        self.payment.save(
            update_fields=["refund_status", "refund_error"]
        )

        result = LateCaptureRefundService.record_late_capture(
            payment_id=self.payment.pk,
            razorpay_payment_id=payment_id,
        )

        self.payment.refresh_from_db()

        self.assertTrue(result)
        self.assertEqual(
            self.payment.razorpay_payment_id,
            payment_id,
        )
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.UNKNOWN,
        )
        self.assertEqual(
            self.payment.refund_error,
            "Previous refund outcome is uncertain.",
        )


    @patch("payments.services.razorpay.Client")
    def test_pending_refund_response_is_not_marked_refunded(
        self,
        mock_razorpay_client,
    ):
        PaymentExpirationService.expire_payment(
            self.payment.pk
        )

        LateCaptureRefundService.record_late_capture(
            payment_id=self.payment.pk,
            razorpay_payment_id="pay_test_refund_pending",
        )

        mock_client = mock_razorpay_client.return_value
        mock_client.payment.refund.return_value = {
            "id": "rfnd_test_pending_001",
            "status": "pending",
            "amount": 30000,
        }

        result = LateCaptureRefundService.process_refund(
            self.payment.pk
        )

        self.payment.refresh_from_db()

        self.assertEqual(
            result,
            Payment.RefundStatus.PROCESSING,
        )
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.PROCESSING,
        )
        self.assertEqual(
            self.payment.razorpay_refund_id,
            "rfnd_test_pending_001",
        )
        self.assertNotEqual(
            self.payment.status,
            Payment.PaymentStatus.REFUNDED,
        )

        mock_client.payment.refund.assert_called_once_with(
            "pay_test_refund_pending",
            {
                "amount": 30000,
                "speed": "normal",
            },
        )


    @patch("payments.services.razorpay.Client")
    def test_processed_refund_marks_payment_refunded(
        self,
        mock_razorpay_client,
    ):
        PaymentExpirationService.expire_payment(
            self.payment.pk
        )

        LateCaptureRefundService.record_late_capture(
            payment_id=self.payment.pk,
            razorpay_payment_id="pay_test_refund_processed",
        )

        mock_client = mock_razorpay_client.return_value
        mock_client.payment.refund.return_value = {
            "id": "rfnd_test_processed_001",
            "status": "processed",
            "amount": 30000,
        }

        result = LateCaptureRefundService.process_refund(
            self.payment.pk
        )

        self.payment.refresh_from_db()
        self.order.refresh_from_db()

        self.assertEqual(
            result,
            Payment.RefundStatus.REFUNDED,
        )
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.REFUNDED,
        )
        self.assertEqual(
            self.payment.status,
            Payment.PaymentStatus.REFUNDED,
        )
        self.assertEqual(
            self.order.payment_status,
            Order.PaymentStatus.REFUNDED,
        )
        self.assertEqual(
            self.payment.razorpay_refund_id,
            "rfnd_test_processed_001",
        )

        mock_client.payment.refund.assert_called_once()


    @patch("payments.services.razorpay.Client")
    def test_failed_refund_response_marks_payment_failed(
        self,
        mock_client_class,
    ):
        self.payment.status = Payment.PaymentStatus.EXPIRED
        self.payment.refund_status = Payment.RefundStatus.PENDING
        self.payment.razorpay_payment_id = "pay_test_failed_001"
        self.payment.save()

        mock_client = mock_client_class.return_value
        mock_client.payment.refund.return_value = {
            "id": "rfnd_test_failed_001",
            "status": "failed",
            "amount": 30000,
        }

        result = LateCaptureRefundService.process_refund(
            self.payment.pk
        )

        self.payment.refresh_from_db()

        self.assertEqual(
            result,
            Payment.RefundStatus.FAILED,
        )
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.FAILED,
        )
        self.assertEqual(
            self.payment.razorpay_refund_id,
            "rfnd_test_failed_001",
        )
        self.assertIn(
            "failed",
            self.payment.refund_error,
        )
        mock_client.payment.refund.assert_called_once()

    @patch("payments.services.razorpay.Client")
    def test_uncertain_refund_outcome_is_not_retried(
        self,
        mock_razorpay_client,
    ):
        from requests.exceptions import Timeout

        PaymentExpirationService.expire_payment(
            self.payment.pk
        )

        LateCaptureRefundService.record_late_capture(
            payment_id=self.payment.pk,
            razorpay_payment_id="pay_test_refund_timeout",
        )

        mock_client = mock_razorpay_client.return_value
        mock_client.payment.refund.side_effect = Timeout(
            "Simulated timeout after sending refund request."
        )

        result = LateCaptureRefundService.process_refund(
            self.payment.pk
        )

        self.payment.refresh_from_db()

        self.assertFalse(result)
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.UNKNOWN,
        )
        self.assertIn(
            "Reconciliation is required",
            self.payment.refund_error,
        )

        # Calling again must not send a second refund request.
        result_again = LateCaptureRefundService.process_refund(
            self.payment.pk
        )

        self.assertFalse(result_again)
        mock_client.payment.refund.assert_called_once()


    @patch("payments.services.razorpay.Client")
    def test_reconcile_refund_marks_completed_refund_as_refunded(
        self,
        mock_client_class,
    ):
        self.payment.status = Payment.PaymentStatus.EXPIRED
        self.payment.refund_status = Payment.RefundStatus.UNKNOWN
        self.payment.razorpay_payment_id = "pay_test_reconcile_001"
        self.payment.razorpay_refund_id = "rfnd_test_reconcile_001"
        self.payment.save()

        mock_client = mock_client_class.return_value
        mock_client.payment.fetch_multiple_refund.return_value = {
            "items": [
                {
                    "id": "rfnd_test_reconcile_001",
                    "amount": 30000,
                    "status": "processed",
                }
            ]
        }

        result = LateCaptureRefundService.reconcile_refund(
            self.payment.pk
        )

        self.payment.refresh_from_db()
        self.order.refresh_from_db()


        self.assertEqual(
            result,
            Payment.RefundStatus.REFUNDED,
        )
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.REFUNDED,
        )
        self.assertEqual(
            self.payment.status,
            Payment.PaymentStatus.REFUNDED,
        )
        self.assertEqual(
            self.order.payment_status,
            Order.PaymentStatus.REFUNDED,
        )
        self.assertEqual(
            self.payment.razorpay_refund_id,
            "rfnd_test_reconcile_001",
        )
        mock_client.payment.fetch_multiple_refund.assert_called_once_with(
            "pay_test_reconcile_001"
        )
        mock_client.payment.refund.assert_not_called()



    @patch("payments.services.razorpay.Client")
    def test_reconcile_without_matching_refund_stays_unknown(
        self,
        mock_client_class,
    ):
        self.payment.status = Payment.PaymentStatus.EXPIRED
        self.payment.refund_status = Payment.RefundStatus.UNKNOWN
        self.payment.razorpay_payment_id = "pay_test_no_match_001"
        self.payment.save()

        mock_client = mock_client_class.return_value
        mock_client.payment.fetch_multiple_refund.return_value = {
            "items": []
        }

        result = LateCaptureRefundService.reconcile_refund(
            self.payment.pk
        )

        self.payment.refresh_from_db()

        self.assertFalse(result)
        self.assertEqual(
            self.payment.refund_status,
            Payment.RefundStatus.UNKNOWN,
        )
        self.assertIn(
            "Could not identify exactly one matching full refund",
            self.payment.refund_error,
        )
        mock_client.payment.refund.assert_not_called()




class ExpirePaymentsCommandTests(PaymentExpirationServiceTests):
    def test_command_expires_payment_and_reports_count(self):
        from django.core.management import call_command
        from io import StringIO

        output = StringIO()

        call_command("expire_payments", stdout=output)

        self.payment.refresh_from_db()
        self.order.refresh_from_db()
        self.variant.refresh_from_db()

        self.assertIn(
            "Expired payments processed: 1",
            output.getvalue(),
        )
        self.assertEqual(
            self.payment.status,
            Payment.PaymentStatus.EXPIRED,
        )
        self.assertEqual(
            self.order.order_status,
            Order.OrderStatus.CANCELLED,
        )
        self.assertEqual(self.variant.stock, 3)


class ReconcileRefundsCommandTests(PaymentExpirationServiceTests):
    @patch("payments.services.LateCaptureRefundService.reconcile_refund")
    def test_command_reports_successful_reconciliation(
        self,
        mock_reconcile,
    ):
        from django.core.management import call_command
        from io import StringIO

        self.payment.refund_status = Payment.RefundStatus.UNKNOWN
        self.payment.razorpay_payment_id = "pay_test_command_001"
        self.payment.save()

        mock_reconcile.return_value = Payment.RefundStatus.REFUNDED
        output = StringIO()

        call_command("reconcile_refunds", stdout=output)

        mock_reconcile.assert_called_once_with(self.payment.pk)
        self.assertIn("Refunds checked: 1", output.getvalue())
        self.assertIn("Resolved: 1", output.getvalue())
        self.assertIn("Still unresolved: 0", output.getvalue())
        self.assertIn("Errors: 0", output.getvalue())

    @patch("payments.services.LateCaptureRefundService.reconcile_refund")
    def test_command_reports_unresolved_refund(
        self,
        mock_reconcile,
    ):
        from django.core.management import call_command
        from io import StringIO

        self.payment.refund_status = Payment.RefundStatus.UNKNOWN
        self.payment.razorpay_payment_id = "pay_test_command_002"
        self.payment.save()

        mock_reconcile.return_value = False
        output = StringIO()

        call_command("reconcile_refunds", stdout=output)

        self.assertIn("Still unresolved: 1", output.getvalue())
        self.assertIn("Errors: 0", output.getvalue())
