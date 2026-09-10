from django.urls import path

from accounts.views.frontend_views import login, register,profile


urlpatterns = [
    path("login/", login, name="login"),
    path( "register/", register, name="register", ),
    path( "profile/", profile, name="profile", ),

]