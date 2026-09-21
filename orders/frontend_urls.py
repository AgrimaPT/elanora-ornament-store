from django.urls import path

from .views import orders_page,order_detail_page

urlpatterns = [
    path("orders/",orders_page,name="orders_page",),

    path(
    "orders/<int:pk>/",
    order_detail_page,
    name="order-detail-page",
),
]
