from django.urls import path

from cart.views import (
    CartAPIView,
    AddToCartAPIView,
    CartItemAPIView,
)

urlpatterns = [
    path(
        "",
        CartAPIView.as_view(),
        name="cart-api",
    ),

    path(
        "add/",
        AddToCartAPIView.as_view(),
        name="add-to-cart",
    ),

    path(
        "items/<int:item_id>/",
        CartItemAPIView.as_view(),
        name="update-cart-item",
    ),
]