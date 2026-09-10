from django.urls import path
from .views.frontend_views import about, contact, product_detail

urlpatterns = [
    path(
        "product/<slug:slug>/",
        product_detail,
        name="product_detail",
    ),
    path(
        "about/",
        about,
        name="about",
    ),
    path(
        "contact/",
        contact,
        name="contact",
    ),
]