from rest_framework import serializers

from products.models import ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "name",
            "price",
            "stock",
            "is_active",
        ]