
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404

from drf_spectacular.utils import extend_schema, OpenApiParameter

from products.models import Product
from products.serializers import ProductDetailSerializer
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)

class ProductDetailAPIView(APIView):

    @extend_schema(
        operation_id="product_detail",
        parameters=[
            OpenApiParameter(
                name="slug",
                type=str,
                location=OpenApiParameter.PATH,
                description="Product slug",
            ),
        ],
        responses={
            200: ProductDetailSerializer,
            404: OpenApiResponse(description="Product not found."),
        },
        description="Retrieve an active product with its category, images and variants.",
    )
    def get(self, request, slug):

        product = get_object_or_404(
            Product,
            slug=slug,
            is_active=True,
        )

        serializer = ProductDetailSerializer(product)

        return Response(serializer.data)
