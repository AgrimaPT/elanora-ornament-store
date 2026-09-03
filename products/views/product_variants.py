from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import ProductVariant
from products.serializers import ProductVariantSerializer


class ProductVariantListAPIView(APIView):

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