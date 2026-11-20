
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)

from products.models import Product
from products.serializers import ProductInventorySerializer


class ProductInventoryAPIView(APIView):

    @extend_schema(
        operation_id="product_inventory",
        parameters=[
            OpenApiParameter(
                name="pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="Product ID",
            ),
        ],
        responses={
            200: ProductInventorySerializer,
            404: OpenApiResponse(description="Product not found."),
        },
        description="Retrieve product stock and variant inventory details.",
    )
    def get(self, request, pk):

        product = get_object_or_404(
            Product,
            pk=pk,
        )

        serializer = ProductInventorySerializer(product)

        return Response(serializer.data)
