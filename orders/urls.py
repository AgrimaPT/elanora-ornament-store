from django.urls import path

from orders.views import (
    CancelOrderAPIView,
    OrderDetailAPIView,
    OrderListAPIView,
    PlaceOrderAPIView,
    UpdateOrderStatusAPIView
)

urlpatterns = [
    path(
        "",
        PlaceOrderAPIView.as_view(),
        name="place-order",
    ),
    path(
        "history/",
        OrderListAPIView.as_view(),
        name="order-history",
    ),
    path(
        "<int:pk>/cancel/",
        CancelOrderAPIView.as_view(),
        name="cancel-order",
    ),
    path(
        "<int:pk>/",
        OrderDetailAPIView.as_view(),
        name="order-detail",
    ),
    path(
        "<int:pk>/status/",
        UpdateOrderStatusAPIView.as_view(),
        name="update-order-status",
    ),
]