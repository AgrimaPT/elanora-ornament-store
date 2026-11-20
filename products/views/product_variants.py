
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)

from products.models import ProductVariant
from products.serializers import ProductVariantSerializer


class ProductVariantListAPIView(APIView):

    @extend_schema(
        operation_id="product_variant_list",
        parameters=[
            OpenApiParameter(
                name="product_id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the product",
            ),
        ],
        responses={
            200: ProductVariantSerializer(many=True),
        },
        description="Retrieve all active variants for a product.",
    )
    def get(self, request, product_id):

        variants = ProductVariant.objects.filter(
            product_id=product_id,
            is_active=True
        )

        serializer = ProductVariantSerializer(
            variants,
            many=True
        )

        return Response(serializer.data)
