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