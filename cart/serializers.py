from rest_framework import serializers

from cart.models import Cart, CartItem
from products.models import Product, ProductVariant


class CartProductSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "price",
            "image",
        )

    def get_image(self, obj):

        image = obj.images.order_by("order").first()

        if image:
            return image.image.url

        return None


class CartVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = (
            "id",
            "name",
            "price",
            "stock",
            "is_active",
        )


class CartItemSerializer(serializers.ModelSerializer):
    product = CartProductSerializer(read_only=True)
    variant = CartVariantSerializer(read_only=True)
    unit_price = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product",
            "variant",
            "quantity",
            "unit_price",
            "subtotal",
        )

    def get_effective_price(self, obj):
        if obj.variant and obj.variant.price is not None:
            return obj.variant.price

        return obj.product.price

    def get_unit_price(self, obj):
        return self.get_effective_price(obj)

    def get_subtotal(self, obj):
        return self.get_effective_price(obj) * obj.quantity

class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cart
        fields = (
            "id",
            "items",
            "created_at",
            "updated_at",
        )


class AddToCartSerializer(serializers.Serializer):

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(
            is_active=True
        )
    )

    variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.filter(
            is_active=True
        ),
        required=False,
        allow_null=True,
    )

    quantity = serializers.IntegerField(
        min_value=1
    )

    def validate(self, attrs):

        product = attrs["product"]

        variant = attrs.get("variant")

        if variant and variant.product_id != product.id:

            raise serializers.ValidationError(
                {
                    "variant":
                    "This variant does not belong to the selected product."
                }
            )

        return attrs


class UpdateCartItemSerializer(serializers.Serializer):

    quantity = serializers.IntegerField(
        min_value=1
    )