import razorpay
from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings

from django.db import transaction
from django.utils import timezone

from orders.models import Order
from payments.models import Payment
from products.models import Product, ProductVariant


class RazorpayServiceError(Exception):
    """Raised when a Razorpay operation fails."""


class RefundOutcomeUnknown(RazorpayServiceError):
    """Raised when the refund result cannot be confirmed."""


class RazorpayService:

    def __init__(self):
        self.client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET,
            )
        )

    @staticmethod
    def amount_to_paise(amount):
        return int(
            (Decimal(amount) * Decimal("100"))
            .quantize(
                Decimal("1"),
                rounding=ROUND_HALF_UP,
            )
        )

    def create_order(self, order):

        amount = self.amount_to_paise(
            order.total_amount
        )

        try:
            razorpay_order = self.client.order.create(
                {
                    "amount": amount,
                    "currency": "INR",
                    "receipt": order.order_number,
                }
            )

        except razorpay.errors.BadRequestError as exc:
            raise RazorpayServiceError(
                "Unable to create Razorpay order."
            ) from exc

        return razorpay_order


    def verify_payment(
        self,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    ):

        try:
            self.client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                }
            )

        except razorpay.errors.SignatureVerificationError as exc:
            raise RazorpayServiceError(
                "Payment signature verification failed."
            ) from exc


    def refund_payment(self, razorpay_payment_id, amount):
        refund_amount = self.amount_to_paise(amount)

        try:
            refund = self.client.payment.refund(
                razorpay_payment_id,
                {
                    "amount": refund_amount,
                    "speed": "normal",
                },
            )

        except (
            razorpay.errors.BadRequestError,
            razorpay.errors.ServerError,
            razorpay.errors.GatewayError,
        ) as exc:
            raise RazorpayServiceError(
                "Unable to process Razorpay refund."
            ) from exc

        return refund

    def verify_webhook_signature(
        self,
        payload,
        signature,
    ):
        if isinstance(payload, bytes):
            payload = payload.decode("utf-8")

        try:
            self.client.utility.verify_webhook_signature(
                payload,
                signature,
                settings.RAZORPAY_WEBHOOK_SECRET,
            )

        except (
            razorpay.errors.SignatureVerificationError,
            UnicodeDecodeError,
        ) as exc:
            raise RazorpayServiceError(
                "Webhook signature verification failed."
            ) from exc



class LateCaptureRefundService:
    """
    Records a payment captured after its order expired
    or was cancelled, without restoring the order.
    """

    @staticmethod
    def record_late_capture(payment_id, razorpay_payment_id):
        with transaction.atomic():
            payment = (
                Payment.objects
                .select_for_update()
                .select_related("order")
                .get(pk=payment_id)
            )

            order = (
                Order.objects
                .select_for_update()
                .get(pk=payment.order_id)
            )

            # Do not change a payment already processed normally.
            if payment.status == Payment.PaymentStatus.PAID:
                return False

            # This service only handles expired or cancelled orders.
            if not (
                payment.status == Payment.PaymentStatus.EXPIRED
                or order.order_status == Order.OrderStatus.CANCELLED
            ):
                return False

            # Preserve the captured payment ID for reconciliation.
            if (
                payment.razorpay_payment_id
                and payment.razorpay_payment_id != razorpay_payment_id
            ):
                raise RazorpayServiceError(
                    "Payment ID does not match the recorded payment."
                )

            payment.razorpay_payment_id = razorpay_payment_id

            # Do not overwrite a completed refund or an active attempt.
            if payment.refund_status not in (
                Payment.RefundStatus.REFUNDED,
                Payment.RefundStatus.PROCESSING,
                Payment.RefundStatus.UNKNOWN,
            ):
                payment.refund_status = Payment.RefundStatus.PENDING
                payment.refund_error = ""
                payment.refund_updated_at = timezone.now()

            payment.save(
                update_fields=[
                    "razorpay_payment_id",
                    "refund_status",
                    "refund_error",
                    "refund_updated_at",
                    "updated_at",
                ]
            )

            return True


    @staticmethod
    def process_refund(payment_id):
        """
        Initiate a refund for a recorded late capture.

        Never automatically retry an uncertain refund outcome.
        """
        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(
                pk=payment_id
            )

            if payment.refund_status != Payment.RefundStatus.PENDING:
                return False

            if not payment.razorpay_payment_id:
                payment.refund_status = Payment.RefundStatus.FAILED
                payment.refund_error = (
                    "Cannot refund without a Razorpay payment ID."
                )
                payment.refund_updated_at = timezone.now()
                payment.save(
                    update_fields=[
                        "refund_status",
                        "refund_error",
                        "refund_updated_at",
                        "updated_at",
                    ]
                )
                return False

            # Claim the attempt before making the external API call.
            payment.refund_status = Payment.RefundStatus.PROCESSING
            payment.refund_error = ""
            payment.refund_updated_at = timezone.now()
            payment.save(
                update_fields=[
                    "refund_status",
                    "refund_error",
                    "refund_updated_at",
                    "updated_at",
                ]
            )

            razorpay_payment_id = payment.razorpay_payment_id
            amount = payment.amount

        # The transaction has ended. Call Razorpay outside the DB lock.
        service = RazorpayService()

        try:
            refund = service.client.payment.refund(
                razorpay_payment_id,
                {
                    "amount": service.amount_to_paise(amount),
                    "speed": "normal",
                },
            )

        except razorpay.errors.BadRequestError as exc:
            # Razorpay rejected the request. Do not retry automatically.
            LateCaptureRefundService._record_refund_failure(
                payment_id,
                status=Payment.RefundStatus.FAILED,
                message=f"Razorpay rejected the refund request: {exc}",
            )
            return False

        except Exception as exc:
            # The request may have reached Razorpay even if we lost
            # the response. Never issue another refund automatically.
            LateCaptureRefundService._record_refund_failure(
                payment_id,
                status=Payment.RefundStatus.UNKNOWN,
                message=(
                    "Refund outcome could not be confirmed. "
                    f"Reconciliation is required. Error: {exc}"
                ),
            )
            return False

        refund_id = refund.get("id") if isinstance(refund, dict) else None
        refund_state = refund.get("status") if isinstance(refund, dict) else None


        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(
                pk=payment_id
            )

            payment.razorpay_refund_id = refund_id
            payment.refund_updated_at = timezone.now()
            payment.refund_error = ""

            if refund_state in ("processed", "completed"):
                payment.refund_status = Payment.RefundStatus.REFUNDED
                payment.status = Payment.PaymentStatus.REFUNDED

            elif refund_state in ("failed", "cancelled"):
                payment.refund_status = Payment.RefundStatus.FAILED
                payment.refund_error = (
                    f"Razorpay reports refund {refund_id} "
                    f"with status '{refund_state}'."
                )

            elif refund_id:
                payment.refund_status = Payment.RefundStatus.PROCESSING

            else:
                payment.refund_status = Payment.RefundStatus.UNKNOWN
                payment.refund_error = (
                    "Razorpay returned no refund ID. "
                    "Reconciliation required."
                )

            payment.save(
                update_fields=[
                    "razorpay_refund_id",
                    "refund_status",
                    "refund_error",
                    "refund_updated_at",
                    "status",
                    "updated_at",
                ]
            )

            # Synchronize the order only after refund confirmation.
            if (
                payment.refund_status
                == Payment.RefundStatus.REFUNDED
            ):
                order = payment.order
                order.payment_status = Order.PaymentStatus.REFUNDED
                order.save(
                    update_fields=[
                        "payment_status",
                        "updated_at",
                    ]
                )


        return payment.refund_status

    @staticmethod
    def _record_refund_failure(payment_id, status, message):
        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(
                pk=payment_id
            )
            payment.refund_status = status
            payment.refund_error = message[:4000]
            payment.refund_updated_at = timezone.now()
            payment.save(
                update_fields=[
                    "refund_status",
                    "refund_error",
                    "refund_updated_at",
                    "updated_at",
                ]
            )


    @staticmethod
    def reconcile_refund(payment_id):
        """
        Check Razorpay's refund records before recovering an
        uncertain or processing refund. Never creates a refund.
        """
        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(
                pk=payment_id
            )

            if payment.refund_status not in (
                Payment.RefundStatus.UNKNOWN,
                Payment.RefundStatus.PROCESSING,
            ):
                return False

            if not payment.razorpay_payment_id:
                payment.refund_error = (
                    "Cannot reconcile without a Razorpay payment ID."
                )
                payment.refund_updated_at = timezone.now()
                payment.save(
                    update_fields=[
                        "refund_error",
                        "refund_updated_at",
                        "updated_at",
                    ]
                )
                return False

            razorpay_payment_id = payment.razorpay_payment_id
            existing_refund_id = payment.razorpay_refund_id
            expected_amount = RazorpayService.amount_to_paise(
                payment.amount
            )

        # Do not hold database locks during the external API call.
        service = RazorpayService()

        try:
            response = service.client.payment.fetch_multiple_refund(
                razorpay_payment_id
            )
        except Exception as exc:
            LateCaptureRefundService._record_refund_failure(
                payment_id,
                status=Payment.RefundStatus.UNKNOWN,
                message=(
                    "Could not verify the refund with Razorpay. "
                    f"Reconciliation must be retried later: {exc}"
                ),
            )
            return False

        refunds = response.get("items", []) if isinstance(response, dict) else []

        if existing_refund_id:
            matching_refunds = [
                refund
                for refund in refunds
                if isinstance(refund, dict)
                and refund.get("id") == existing_refund_id
                and refund.get("amount") == expected_amount
            ]
        else:
            matching_refunds = [
                refund
                for refund in refunds
                if isinstance(refund, dict)
                and refund.get("amount") == expected_amount
                and refund.get("id")
            ]

        # Do not guess if Razorpay returns multiple full-amount refunds.
        if len(matching_refunds) != 1:
            LateCaptureRefundService._record_refund_failure(
                payment_id,
                status=Payment.RefundStatus.UNKNOWN,
                message=(
                    "Could not identify exactly one matching full refund. "
                    "Manual review or another reconciliation is required."
                ),
            )
            return False

        refund = matching_refunds[0]
        refund_id = refund["id"]
        refund_state = refund.get("status")



        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(
                pk=payment_id
            )

            payment.razorpay_refund_id = refund_id
            payment.refund_updated_at = timezone.now()
            payment.refund_error = ""

            if refund_state in ("processed", "completed"):
                payment.refund_status = Payment.RefundStatus.REFUNDED
                payment.status = Payment.PaymentStatus.REFUNDED
            elif refund_state in ("failed", "cancelled"):
                payment.refund_status = Payment.RefundStatus.FAILED
                payment.refund_error = (
                    f"Razorpay reports that refund {refund_id} "
                    f"has status '{refund_state}'."
                )
            else:
                payment.refund_status = Payment.RefundStatus.PROCESSING

            payment.save(
                update_fields=[
                    "razorpay_refund_id",
                    "refund_status",
                    "refund_error",
                    "refund_updated_at",
                    "status",
                    "updated_at",
                ]
            )

            # Synchronize the order only after refund confirmation.
            if (
                payment.refund_status
                == Payment.RefundStatus.REFUNDED
            ):
                order = payment.order
                order.payment_status = Order.PaymentStatus.REFUNDED
                order.save(
                    update_fields=[
                        "payment_status",
                        "updated_at",
                    ]
                )

        return payment.refund_status


class PaymentExpirationService:

    @staticmethod
    def expire_payment(payment_id):
        with transaction.atomic():

            # -----------------------------------------------------
            # 1. Lock the payment
            # -----------------------------------------------------
            payment = (
                Payment.objects
                .select_for_update()
                .select_related("order")
                .get(pk=payment_id)
            )

            # -----------------------------------------------------
            # 2. Payment already completed
            # -----------------------------------------------------
            if payment.status == Payment.PaymentStatus.PAID:
                return False

            # -----------------------------------------------------
            # 3. Payment already expired
            # -----------------------------------------------------
            if payment.status == Payment.PaymentStatus.EXPIRED:
                return False

            # -----------------------------------------------------
            # 4. Check expiration time
            # -----------------------------------------------------
            if (
                payment.expires_at is None
                or payment.expires_at > timezone.now()
            ):
                return False

            # -----------------------------------------------------
            # 5. Lock the related order
            # -----------------------------------------------------
            order = (
                Order.objects
                .select_for_update()
                .get(pk=payment.order_id)
            )

            # -----------------------------------------------------
            # 6. If order was already cancelled,
            #    only expire the payment.
            # -----------------------------------------------------
            if order.order_status == Order.OrderStatus.CANCELLED:

                payment.status = (
                    Payment.PaymentStatus.EXPIRED
                )

                payment.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )

                if order.payment_status != (
                    Order.PaymentStatus.PAID
                ):
                    order.payment_status = (
                        Order.PaymentStatus.EXPIRED
                    )

                    order.save(
                        update_fields=[
                            "payment_status",
                            "updated_at",
                        ]
                    )

                return True

            # -----------------------------------------------------
            # 7. Only pending orders may release reserved stock
            # -----------------------------------------------------
            if order.order_status != Order.OrderStatus.PENDING:
                return False

            # -----------------------------------------------------
            # 8. Get order items
            # -----------------------------------------------------
            order_items = order.items.all()

            # -----------------------------------------------------
            # 9. Restore reserved stock
            # -----------------------------------------------------
            for order_item in order_items:

                if order_item.variant_id:

                    variant = (
                        ProductVariant.objects
                        .select_for_update()
                        .get(
                            pk=order_item.variant_id
                        )
                    )

                    variant.stock += order_item.quantity

                    variant.save(
                        update_fields=["stock"]
                    )

                else:

                    product = (
                        Product.objects
                        .select_for_update()
                        .get(
                            pk=order_item.product_id
                        )
                    )

                    product.stock += order_item.quantity

                    product.save(
                        update_fields=["stock"]
                    )

            # -----------------------------------------------------
            # 10. Expire payment
            # -----------------------------------------------------
            payment.status = (
                Payment.PaymentStatus.EXPIRED
            )

            payment.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            # -----------------------------------------------------
            # 11. Cancel order
            # -----------------------------------------------------
            order.order_status = (
                Order.OrderStatus.CANCELLED
            )

            order.payment_status = (
                Order.PaymentStatus.EXPIRED
            )

            order.save(
                update_fields=[
                    "order_status",
                    "payment_status",
                    "updated_at",
                ]
            )

            return True