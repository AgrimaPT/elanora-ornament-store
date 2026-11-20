
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema

from products.serializers.category import CategorySerializer
from products.models import Category

class CategoryListAPIView(APIView):

    @extend_schema(
        operation_id="category_list",
        responses={
            200: CategorySerializer(many=True),
        },
        description="Retrieve all active product categories.",
    )
    def get(self, request):
        categories = Category.objects.filter(
            is_active=True
        )

        serializer = CategorySerializer(
            categories,
            many=True,
        )

        return Response(serializer.data)
