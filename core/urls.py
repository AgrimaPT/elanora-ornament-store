from django.urls import path

from core.views import home, shop


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
]