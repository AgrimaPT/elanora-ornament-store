from rest_framework import serializers

from cart.models import Cart, CartItem
from products.models import Product


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
    

class CartItemSerializer(serializers.ModelSerializer):

    product = CartProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product",
            "quantity",
            "subtotal",
            #we don't want to expose cart number to the frontend.so no cart field
        )

    def get_subtotal(self, obj):
        return obj.product.price * obj.quantity
    

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
        queryset=Product.objects.filter(is_active=True)
    )

    quantity = serializers.IntegerField(
        min_value=1
    )


class UpdateCartItemSerializer(serializers.Serializer):

    quantity = serializers.IntegerField(
        min_value=1
    )