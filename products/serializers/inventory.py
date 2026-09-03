from rest_framework import serializers

from products.models import Product,ProductVariant



class VariantInventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "name",
            "stock",
            "is_active",
        ]

class ProductInventorySerializer(serializers.ModelSerializer):
    variants = VariantInventorySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "stock",
            "is_active",
            "variants",
        ]

