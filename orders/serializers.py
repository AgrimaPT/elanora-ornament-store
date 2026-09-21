from rest_framework import serializers

from accounts.models import Address
from orders.models import Order, OrderItem
from products.models import Product, ProductVariant


class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
        )


class OrderVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = (
            "id",
            "name",
        )


class OrderItemSerializer(serializers.ModelSerializer):
    product = OrderProductSerializer(read_only=True)
    variant = OrderVariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product",
            "variant",
            "quantity",
            "unit_price",
            "subtotal",
        )


class OrderShippingAddressSerializer(serializers.Serializer):
    full_name = serializers.CharField(
        source="shipping_full_name"
    )
    phone_number = serializers.CharField(
        source="shipping_phone_number"
    )
    address_line_1 = serializers.CharField(
        source="shipping_address_line_1"
    )
    address_line_2 = serializers.CharField(
        source="shipping_address_line_2"
    )
    city = serializers.CharField(
        source="shipping_city"
    )
    state = serializers.CharField(
        source="shipping_state"
    )
    pincode = serializers.CharField(
        source="shipping_pincode"
    )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    shipping_address = OrderShippingAddressSerializer(
        source="*",
        read_only=True
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "order_status",
            "payment_status",
            "total_amount",
            "shipping_address",
            "items",
            "created_at",
            "updated_at",
        )


class PlaceOrderSerializer(serializers.Serializer):
    address_id = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all()
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            self.fields["address_id"].queryset = Address.objects.filter(
                user=request.user
            )


class UpdateOrderStatusSerializer(serializers.Serializer):
    order_status = serializers.ChoiceField(
        choices=Order.OrderStatus.choices
    )

    def validate_order_status(self, value):
        order = self.context["order"]

        allowed_transitions = {
            Order.OrderStatus.PENDING: {
                Order.OrderStatus.CONFIRMED,
            },
            Order.OrderStatus.CONFIRMED: {
                Order.OrderStatus.PROCESSING,
            },
            Order.OrderStatus.PROCESSING: {
                Order.OrderStatus.SHIPPED,
            },
            Order.OrderStatus.SHIPPED: {
                Order.OrderStatus.DELIVERED,
            },
            Order.OrderStatus.DELIVERED: set(),
            Order.OrderStatus.CANCELLED: set(),
        }

        allowed_statuses = allowed_transitions[
            order.order_status
        ]

        if value not in allowed_statuses:
            raise serializers.ValidationError(
                "Invalid order status transition."
            )

        return value