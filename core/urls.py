from django.urls import path

from core.views import home, shop, checkout


urlpatterns = [
    path(
        "",
        home,
        name="home",
    ),

    path(
        "shop/",
        shop,
        name="shop",
    ),

    path(
        "checkout/",
        checkout,
        name="checkout",
    ),
]