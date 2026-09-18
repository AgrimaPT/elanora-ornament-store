from rest_framework import serializers

from products.models import Product

from .category import CategorySerializer
from .product_image import ProductImageSerializer
from .product_variant import ProductVariantSerializer


class ProductDetailSerializer(serializers.ModelSerializer):

    category = CategorySerializer(
        read_only=True,
    )

    images = ProductImageSerializer(
        many=True,
        read_only=True,
    )

    variants = ProductVariantSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "price",
            "stock",
            "category",
            "images",
            "variants",
        )