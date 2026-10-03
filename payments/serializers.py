from rest_framework import serializers

from orders.models import Order


class CreatePaymentSerializer(serializers.Serializer):
    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(),
    )

    def validate_order_id(self, order):
        request = self.context["request"]

        if order.user != request.user:
            raise serializers.ValidationError(
                "You do not have permission to pay for this order."
            )

        if order.payment_status == Order.PaymentStatus.PAID:
            raise serializers.ValidationError(
                "This order has already been paid."
            )

        if order.order_status == Order.OrderStatus.CANCELLED:
            raise serializers.ValidationError(
                "Cancelled orders cannot be paid."
            )

        return order



class VerifyPaymentSerializer(serializers.Serializer):

    razorpay_order_id = serializers.CharField(
        max_length=100
    )

    razorpay_payment_id = serializers.CharField(
        max_length=100
    )

    razorpay_signature = serializers.CharField(
        max_length=255
    )