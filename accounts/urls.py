from django.urls import path

from .views import RegisterAPIView,UserListAPIView,LoginAPIView,ProfileAPIView,UpdateProfileAPIView,ChangePasswordAPIView


urlpatterns = [
    path("users/", UserListAPIView.as_view(), name="user-list"),
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/",LoginAPIView.as_view(),name="login"),
    path("profile/",ProfileAPIView.as_view(),name="profile"),
    path("profile/update/",UpdateProfileAPIView.as_view(),name="update-profile"),
    path("change-password/",ChangePasswordAPIView.as_view(),name="change-password"),




]