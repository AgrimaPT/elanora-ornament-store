from rest_framework import serializers

from products.models import Product

from .category import CategorySerializer
from drf_spectacular.utils import extend_schema_field

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image = serializers.SerializerMethodField() #"The image value isn't directly a model field. I'll calculate it using a method."dont need whole images of a product. Instead, we'll create a calculated serializer field.

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "price",
            "stock",
            "category",
            "image",
        )
    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_image(self, obj):
        image = obj.images.order_by("order").first()

        if image:
            return image.image.url  #The first image is our Python variable.The second image is the model field:

        return None