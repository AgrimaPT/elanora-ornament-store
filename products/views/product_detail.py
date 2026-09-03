from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404

from products.models import Product
from products.serializers import ProductDetailSerializer


class ProductDetailAPIView(APIView):

    def get(self, request, slug):

        product = get_object_or_404(
            Product,
            slug=slug,
            is_active=True,
        )

        serializer = ProductDetailSerializer(product)

        return Response(serializer.data)