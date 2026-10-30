import json
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from orders.models import Order
from payments.models import Payment, WebhookEvent
from payments.serializers import (
    CreatePaymentSerializer,
    VerifyPaymentSerializer,
)
from payments.services import (
    LateCaptureRefundService,
    RazorpayService,
    RazorpayServiceError,
)

class CreatePaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreatePaymentSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.validated_data["order_id"]

        # Lock the order while checking payment eligibility.
        with transaction.atomic():
            order = (
                Order.objects
                .select_for_update()
                .get(pk=order.pk)
            )

            if order.payment_status == Order.PaymentStatus.PAID:
                return Response(
                    {"detail": "This order has already been paid."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if order.order_status != Order.OrderStatus.PENDING:
                return Response(
                    {"detail": "This order is no longer eligible for payment."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            existing_payment = (
                Payment.objects
                .select_for_update()
                .filter(order=order)
                .first()
            )

            if existing_payment:
                if existing_payment.status == Payment.PaymentStatus.PAID:
                    return Response(
                        {"detail": "This order has already been paid."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if existing_payment.status == Payment.PaymentStatus.EXPIRED:
                    return Response(
                        {
                            "detail": (
                                "This payment has expired. "
                                "Please start a new checkout."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if (
                    existing_payment.expires_at
                    and existing_payment.expires_at <= timezone.now()
                ):
                    return Response(
                        {
                            "detail": (
                                "This payment has expired. "
                                "Please start a new checkout."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if existing_payment.status == Payment.PaymentStatus.FAILED:
                    return Response(
                        {
                            "detail": (
                                "This payment attempt failed. "
                                "Please check its status before retrying."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if existing_payment.razorpay_order_id:
                    return Response(
                        {
                            "payment_id": existing_payment.id,
                            "order_id": order.id,
                            "order_number": order.order_number,
                            "razorpay_order_id": (
                                existing_payment.razorpay_order_id
                            ),
                            "amount": str(existing_payment.amount),
                            "amount_in_paise": (
                                RazorpayService.amount_to_paise(
                                    existing_payment.amount
                                )
                            ),
                            "currency": "INR",
                            "key_id": settings.RAZORPAY_KEY_ID,
                            "expires_at": existing_payment.expires_at,
                        },
                        status=status.HTTP_200_OK,
                    )

            # Create the Razorpay order while no local payment exists.
            service = RazorpayService()

            try:
                razorpay_order = service.create_order(order)
            except RazorpayServiceError:
                return Response(
                    {
                        "detail": (
                            "Unable to create payment order. "
                            "Please try again."
                        )
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            expires_at = (
                timezone.now()
                + timedelta(
                    minutes=settings.PAYMENT_EXPIRY_MINUTES
                )
            )

            payment = Payment.objects.create(
                order=order,
                razorpay_order_id=razorpay_order["id"],
                amount=order.total_amount,
                status=Payment.PaymentStatus.CREATED,
                expires_at=expires_at,
            )

        return Response(
            {
                "payment_id": payment.id,
                "order_id": order.id,
                "order_number": order.order_number,
                "razorpay_order_id": payment.razorpay_order_id,
                "amount": str(payment.amount),
                "amount_in_paise": (
                    RazorpayService.amount_to_paise(payment.amount)
                ),
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID,
                "expires_at": payment.expires_at,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # ---------------------------------------------------------
        # 1. Validate Razorpay payment data
        # ---------------------------------------------------------
        serializer = VerifyPaymentSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        razorpay_order_id = (
            serializer.validated_data[
                "razorpay_order_id"
            ]
        )

        razorpay_payment_id = (
            serializer.validated_data[
                "razorpay_payment_id"
            ]
        )

        razorpay_signature = (
            serializer.validated_data[
                "razorpay_signature"
            ]
        )

        # ---------------------------------------------------------
        # 2. Find the payment
        # ---------------------------------------------------------
        payment = (
            Payment.objects
            .filter(
                razorpay_order_id=(
                    razorpay_order_id
                )
            )
            .select_related("order")
            .first()
        )

        if payment is None:

            return Response(
                {
                    "detail": (
                        "Payment order not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # ---------------------------------------------------------
        # 3. Verify payment ownership
        # ---------------------------------------------------------
        if (
            payment.order.user
            != request.user
        ):

            return Response(
                {
                    "detail": (
                        "You do not have permission "
                        "to verify this payment."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # ---------------------------------------------------------
        # 4. Prevent duplicate verification
        # ---------------------------------------------------------
        if (
            payment.status
            == Payment.PaymentStatus.PAID
        ):

            return Response(
                {
                    "detail": (
                        "Payment already verified."
                    ),
                    "payment_id": payment.id,
                    "order_id": (
                        payment.order.id
                    ),
                    "order_number": (
                        payment.order.order_number
                    ),
                    "status": payment.status,
                },
                status=status.HTTP_200_OK,
            )

        # ---------------------------------------------------------
        # 5. Prevent expired/cancelled payment
        # ---------------------------------------------------------
        if (
            payment.status
            == Payment.PaymentStatus.EXPIRED
        ):

            return Response(
                {
                    "detail": (
                        "This payment has expired."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            payment.order.order_status
            == Order.OrderStatus.CANCELLED
        ):

            return Response(
                {
                    "detail": (
                        "This order has been cancelled."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 6. Verify payment has not passed expiration
        # ---------------------------------------------------------
        if (
            payment.expires_at is not None
            and payment.expires_at
            <= timezone.now()
        ):

            return Response(
                {
                    "detail": (
                        "This payment has expired."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 7. Verify Razorpay signature
        # ---------------------------------------------------------
        service = RazorpayService()

        try:

            service.verify_payment(
                razorpay_order_id=(
                    razorpay_order_id
                ),
                razorpay_payment_id=(
                    razorpay_payment_id
                ),
                razorpay_signature=(
                    razorpay_signature
                ),
            )

        except RazorpayServiceError:

            payment.status = (
                Payment.PaymentStatus.FAILED
            )

            payment.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            return Response(
                {
                    "detail": (
                        "Payment verification failed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 8. Finalize purchase atomically
        # ---------------------------------------------------------
        with transaction.atomic():

            # -----------------------------------------------------
            # 8.1 Lock payment
            # -----------------------------------------------------
            payment = (
                Payment.objects
                .select_for_update()
                .select_related("order")
                .get(pk=payment.pk)
            )

            # -----------------------------------------------------
            # 8.2 Check duplicate verification again
            # -----------------------------------------------------
            if (
                payment.status
                == Payment.PaymentStatus.PAID
            ):

                return Response(
                    {
                        "detail": (
                            "Payment already verified."
                        ),
                        "payment_id": (
                            payment.id
                        ),
                        "order_id": (
                            payment.order.id
                        ),
                        "order_number": (
                            payment.order.order_number
                        ),
                        "status": (
                            payment.status
                        ),
                    },
                    status=status.HTTP_200_OK,
                )

            # -----------------------------------------------------
            # 8.3 Prevent expired payment
            # -----------------------------------------------------
            if (
                payment.status
                == Payment.PaymentStatus.EXPIRED
            ):

                return Response(
                    {
                        "detail": (
                            "This payment has expired."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # -----------------------------------------------------
            # 8.4 Lock order
            # -----------------------------------------------------
            order = (
                Order.objects
                .select_for_update()
                .get(pk=payment.order_id)
            )

            # -----------------------------------------------------
            # 8.5 Prevent cancelled order resurrection
            # -----------------------------------------------------
            if (
                order.order_status
                == Order.OrderStatus.CANCELLED
            ):

                return Response(
                    {
                        "detail": (
                            "This order has been cancelled."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )


            # Prevent finalizing a payment after its deadline.
            if (
                payment.expires_at is not None
                and payment.expires_at <= timezone.now()
            ):
                return Response(
                    {
                        "detail": (
                            "This payment has expired."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )


            # -----------------------------------------------------
            # 8.6 Get order items
            # -----------------------------------------------------
            order_items = list(
                order.items.select_related(
                    "product",
                    "variant",
                )
            )

            # -----------------------------------------------------
            # 8.7 Remove purchased items from cart
            # -----------------------------------------------------
            cart = (
                Cart.objects
                .select_for_update()
                .filter(
                    user=request.user
                )
                .first()
            )

            if cart:

                for order_item in order_items:

                    cart_item = (
                        cart.items
                        .filter(
                            product_id=(
                                order_item.product_id
                            ),
                            variant_id=(
                                order_item.variant_id
                            ),
                        )
                        .first()
                    )

                    if cart_item:

                        cart_item.delete()

            # -----------------------------------------------------
            # 8.8 Mark payment as paid
            # -----------------------------------------------------
            payment.razorpay_payment_id = (
                razorpay_payment_id
            )

            payment.razorpay_signature = (
                razorpay_signature
            )

            payment.status = (
                Payment.PaymentStatus.PAID
            )

            payment.save(
                update_fields=[
                    "razorpay_payment_id",
                    "razorpay_signature",
                    "status",
                    "updated_at",
                ]
            )

            # -----------------------------------------------------
            # 8.9 Mark order as confirmed
            # -----------------------------------------------------
            order.payment_status = (
                Order.PaymentStatus.PAID
            )

            order.order_status = (
                Order.OrderStatus.CONFIRMED
            )

            order.save(
                update_fields=[
                    "payment_status",
                    "order_status",
                    "updated_at",
                ]
            )

        # ---------------------------------------------------------
        # 9. Return successful verification response
        # ---------------------------------------------------------
        return Response(
            {
                "detail": (
                    "Payment verified successfully."
                ),
                "payment_id": payment.id,
                "order_id": order.id,
                "order_number": (
                    order.order_number
                ),
                "payment_status": (
                    payment.status
                ),
                "order_status": (
                    order.order_status
                ),
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(
    csrf_exempt,
    name="dispatch",
)
class RazorpayWebhookAPIView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        # ---------------------------------------------------------
        # 1. Read raw webhook body
        # ---------------------------------------------------------
        payload = request.body

        # ---------------------------------------------------------
        # 2. Read Razorpay signature
        # ---------------------------------------------------------
        signature = request.headers.get(
            "X-Razorpay-Signature"
        )

        if not signature:

            return Response(
                {
                    "detail": (
                        "Missing webhook signature."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 3. Read unique webhook event ID
        # ---------------------------------------------------------
        event_id = request.headers.get(
            "X-Razorpay-Event-Id"
        )

        if not event_id:

            return Response(
                {
                    "detail": (
                        "Missing webhook event ID."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 4. Verify webhook signature
        # ---------------------------------------------------------
        service = RazorpayService()

        try:

            service.verify_webhook_signature(
                payload=payload,
                signature=signature,
            )

        except RazorpayServiceError:

            return Response(
                {
                    "detail": (
                        "Invalid webhook signature."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 5. Parse verified payload
        # ---------------------------------------------------------
        try:

            data = json.loads(payload)

        except json.JSONDecodeError:

            return Response(
                {
                    "detail": (
                        "Invalid webhook payload."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_type = data.get("event")

        if not event_type:

            return Response(
                {
                    "detail": (
                        "Webhook event type is missing."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 6. Ignore unsupported events safely
        # ---------------------------------------------------------
        if event_type != "payment.captured":

            WebhookEvent.objects.get_or_create(
                event_id=event_id,
                defaults={
                    "event_type": event_type,
                },
            )

            return Response(
                {
                    "detail": (
                        "Webhook received."
                    )
                },
                status=status.HTTP_200_OK,
            )

        # ---------------------------------------------------------
        # 7. Extract payment information
        # ---------------------------------------------------------
        payment_entity = (
            data.get("payload", {})
            .get("payment", {})
            .get("entity", {})
        )

        razorpay_payment_id = (
            payment_entity.get("id")
        )

        razorpay_order_id = (
            payment_entity.get("order_id")
        )

        razorpay_amount = (
            payment_entity.get("amount")
        )

        razorpay_currency = (
            payment_entity.get("currency")
        )

        razorpay_status = (
            payment_entity.get("status")
        )

        if (
            not razorpay_payment_id
            or not razorpay_order_id
        ):

            return Response(
                {
                    "detail": (
                        "Payment information is missing."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 8. Verify captured status
        # ---------------------------------------------------------
        if razorpay_status != "captured":

            return Response(
                {
                    "detail": (
                        "Invalid captured payment status."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 9. Find local Payment
        # ---------------------------------------------------------
        payment = (
            Payment.objects
            .select_related("order")
            .filter(
                razorpay_order_id=(
                    razorpay_order_id
                )
            )
            .first()
        )

        if payment is None:

            return Response(
                {
                    "detail": (
                        "Local payment record not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # ---------------------------------------------------------
        # 10. Verify payment amount
        # ---------------------------------------------------------
        expected_amount = (
            RazorpayService
            .amount_to_paise(
                payment.amount
            )
        )

        if razorpay_amount != expected_amount:

            return Response(
                {
                    "detail": (
                        "Payment amount mismatch."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 11. Verify payment currency
        # ---------------------------------------------------------
        if razorpay_currency != "INR":

            return Response(
                {
                    "detail": (
                        "Unsupported payment currency."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 12. Finalize webhook transaction atomically
        # ---------------------------------------------------------
        with transaction.atomic():

            # -----------------------------------------------------
            # 12.1 Lock payment
            # -----------------------------------------------------
            payment = (
                Payment.objects
                .select_for_update()
                .select_related("order")
                .get(pk=payment.pk)
            )

            # -----------------------------------------------------
            # 12.2 Lock order
            # -----------------------------------------------------
            order = (
                Order.objects
                .select_for_update()
                .get(pk=payment.order_id)
            )

            # -----------------------------------------------------
            # 12.3 Record webhook event
            # -----------------------------------------------------
            webhook_event, created = (
                WebhookEvent.objects.get_or_create(
                    event_id=event_id,
                    defaults={
                        "event_type": event_type,
                    },
                )
            )

            if not created:

                return Response(
                    {
                        "detail": (
                            "Webhook event already "
                            "processed."
                        )
                    },
                    status=status.HTTP_200_OK,
                )

            # -----------------------------------------------------
            # 12.4 Ignore already-paid payment
            # -----------------------------------------------------
            if (
                payment.status
                == Payment.PaymentStatus.PAID
            ):

                return Response(
                    {
                        "detail": (
                            "Payment already processed."
                        )
                    },
                    status=status.HTTP_200_OK,
                )


            # -----------------------------------------------------
            # 12.5 Handle a late capture for an expired payment
            # -----------------------------------------------------
            if (
                payment.status
                == Payment.PaymentStatus.EXPIRED
            ):
                recorded = (
                    LateCaptureRefundService.record_late_capture(
                        payment_id=payment.id,
                        razorpay_payment_id=razorpay_payment_id,
                    )
                )

                if recorded:
                    # Initiate the refund only after the webhook
                    # transaction has committed.
                    transaction.on_commit(
                        lambda payment_id=payment.id:
                            LateCaptureRefundService.process_refund(
                                payment_id
                            )
                    )

                return Response(
                    {
                        "detail": (
                            "Late payment received. "
                            "Refund processing has been scheduled."
                            if recorded
                            else
                            "Payment received for an expired payment."
                        )
                    },
                    status=status.HTTP_200_OK,
                )



            # -----------------------------------------------------
            # 12.6 Handle a late capture for a cancelled order
            # -----------------------------------------------------
            if (
                order.order_status
                == Order.OrderStatus.CANCELLED
            ):
                recorded = (
                    LateCaptureRefundService.record_late_capture(
                        payment_id=payment.id,
                        razorpay_payment_id=razorpay_payment_id,
                    )
                )

                if recorded:
                    # Initiate the refund only after the outer
                    # webhook transaction has committed.
                    transaction.on_commit(
                        lambda payment_id=payment.id:
                            LateCaptureRefundService.process_refund(
                                payment_id
                            )
                    )

                return Response(
                    {
                        "detail": (
                            "Late payment received. "
                            "Refund processing has been scheduled."
                            if recorded
                            else
                            "Payment received for a cancelled order."
                        )
                    },
                    status=status.HTTP_200_OK,
                )

            # -----------------------------------------------------
            # 12.7 Get order items
            # -----------------------------------------------------
            order_items = list(
                order.items.select_related(
                    "product",
                    "variant",
                )
            )

            # -----------------------------------------------------
            # 12.8 Save Razorpay payment ID
            # -----------------------------------------------------
            payment.razorpay_payment_id = (
                razorpay_payment_id
            )

            payment.status = (
                Payment.PaymentStatus.PAID
            )

            payment.save(
                update_fields=[
                    "razorpay_payment_id",
                    "status",
                    "updated_at",
                ]
            )

            # -----------------------------------------------------
            # 12.9 Mark order paid and confirmed
            # -----------------------------------------------------
            order.payment_status = (
                Order.PaymentStatus.PAID
            )

            order.order_status = (
                Order.OrderStatus.CONFIRMED
            )

            order.save(
                update_fields=[
                    "payment_status",
                    "order_status",
                    "updated_at",
                ]
            )

            # -----------------------------------------------------
            # 12.10 Remove purchased items from cart
            # -----------------------------------------------------
            cart = (
                Cart.objects
                .select_for_update()
                .filter(
                    user=order.user
                )
                .first()
            )

            if cart:

                for order_item in order_items:

                    cart_item = (
                        cart.items
                        .filter(
                            product_id=(
                                order_item.product_id
                            ),
                            variant_id=(
                                order_item.variant_id
                            ),
                        )
                        .first()
                    )

                    if cart_item:

                        cart_item.delete()

        # ---------------------------------------------------------
        # 13. Return success response
        # ---------------------------------------------------------
        return Response(
            {
                "detail": (
                    "Webhook processed successfully."
                ),
                "payment_id": payment.id,
                "order_id": order.id,
                "order_number": (
                    order.order_number
                ),
                "payment_status": (
                    payment.status
                ),
                "order_status": (
                    order.order_status
                ),
            },
            status=status.HTTP_200_OK,
        )