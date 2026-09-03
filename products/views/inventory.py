from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404

from products.models import Product
from products.serializers import ProductInventorySerializer


class ProductInventoryAPIView(APIView):

    def get(self, request, pk):

        product = get_object_or_404(
            Product,
            pk=pk,
        )

        serializer = ProductInventorySerializer(product)

        return Response(serializer.data)