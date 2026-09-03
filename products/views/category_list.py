from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Category
from products.serializers.category import CategorySerializer


class CategoryListAPIView(APIView):

    def get(self, request):
        categories = Category.objects.filter(
            is_active=True
        )

        serializer = CategorySerializer(
            categories,
            many=True,
        )

        return Response(serializer.data)