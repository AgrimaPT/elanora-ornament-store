
from django.urls import path

from core.views import home, shop, checkout, ContactMessageCreateView

urlpatterns = [
    path("", home, name="home"),
    path("shop/", shop, name="shop"),
    path("checkout/", checkout, name="checkout"),

    path(
        "api/contact/",
        ContactMessageCreateView.as_view(),
        name="contact-message-create",
    ),
]
