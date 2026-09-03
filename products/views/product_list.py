from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product

from products.serializers import (
    ProductListSerializer,
    ProductFilterSerializer,
)

from products.pagination.product_pagination import ProductPagination


class ProductListAPIView(APIView):

    pagination_class = ProductPagination

    def get(self, request):

        # -------------------------
        # Validate filter parameters
        # -------------------------

        filter_serializer = ProductFilterSerializer(
            data=request.query_params
        )

        filter_serializer.is_valid(
            raise_exception=True
        )

        filters = filter_serializer.validated_data

        
        # -------------------------
        # Base QuerySet
        # -------------------------

        products = Product.objects.filter(
            is_active=True
        )


        # -------------------------
        # Search filter
        # -------------------------

        search = filters.get("search")

        if search:
            products = products.filter(
                name__icontains=search
            )

        # -------------------------
        # Category filter
        # -------------------------

        category = filters.get("category")

        if category:
            products = products.filter(
                category__slug=category
            )

        # -------------------------
        # Featured filter
        # -------------------------

        if "featured" in request.query_params:

            featured = filters.get("featured")

            products = products.filter(
                is_featured=featured
            )

        # -------------------------
        # Minimum price filter
        # -------------------------

        min_price = filters.get("min_price")

        if min_price is not None:
            products = products.filter(
                price__gte=min_price
            )

        # -------------------------
        # Maximum price filter
        # -------------------------

        max_price = filters.get("max_price")

        if max_price is not None:
            products = products.filter(
                price__lte=max_price
            )

        # -------------------------
        # Product ordering
        # -------------------------

        ordering = filters.get("ordering")

        if ordering:
            products = products.order_by(ordering)

        # -------------------------
        # Pagination
        # -------------------------

        paginator = self.pagination_class()

        
        page = paginator.paginate_queryset(
            products,
            request,
            view=self
        )






       

        # -------------------------
        # Serialization
        # -------------------------

        serializer = ProductListSerializer(
            page,
            many=True
        )

        

        # -------------------------
        # Paginated response
        # -------------------------

        return paginator.get_paginated_response(
            serializer.data
        )


        

####before ProductFilterSerializer

# class ProductListAPIView(APIView):

#     def get(self, request):

#         filter_serializer = ProductFilterSerializer(data=request.query_params)

#         products = Product.objects.filter(
#             is_active=True
#         )

#         if search:
#             products = products.filter(
#                 name__icontains=search
#             )

#         if category:
#             products = products.filter(
#                 category__slug=category
#             )

#         if min_price:
#             products = products.filter(
#                 price__gte=min_price
#             )

#         if max_price:
#             products = products.filter(
#                 price__lte=max_price
#             )

#         serializer = ProductListSerializer(
#             products,
#             many=True,
#         )

#         return Response(serializer.data)