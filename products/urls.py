from django.urls import path

from products.views.category_list import CategoryListAPIView
from products.views.product_detail import ProductDetailAPIView
from products.views.product_list import ProductListAPIView
from products.views.product_variants import ProductVariantListAPIView
from products.views.inventory import ProductInventoryAPIView


urlpatterns = [
    path(
        "",
        ProductListAPIView.as_view(),
        name="product-list",
    ),

    path(
        "categories/",
        CategoryListAPIView.as_view(),
        name="category-list",
    ),

    path(
        "<slug:slug>/",
        ProductDetailAPIView.as_view(),
        name="product-detail",
    ),

    path(
        "<int:product_id>/variants/",
        ProductVariantListAPIView.as_view(),
        name="product-variant",
    ),

    path(
        "<int:pk>/inventory/",
        ProductInventoryAPIView.as_view(),
        name="product-inventory",
    ),
    
]