from django.urls import path

from .views import RegisterAPIView, UserListAPIView

urlpatterns = [
    path("users/", UserListAPIView.as_view(), name="user-list"),
    path("register/", RegisterAPIView.as_view(), name="register"),
]