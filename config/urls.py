

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


urlpatterns = [
    path(
        "",
        include("core.urls"),
    ),

    path('admin/', admin.site.urls),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    path(
        "api/auth/",
        include("accounts.urls")),

    path(
        "api/products/",
        include("products.urls"),
    ),

    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "",
        include("products.frontend_urls"),
    ),

    path(
        "",
        include("accounts.frontend_urls"),
    ),

    path("",
         include("cart.frontend_urls")
    ),

    path(
        "api/cart/",
        include("cart.urls"),
    ),

    path("api/orders/", include("orders.urls")),

    path(
        "",
        include("orders.frontend_urls"),
    ),

    path(
        "api/payment/",
        include("payments.urls"),
    ),

    path(
        "api/ai/",
        include("ai.urls"),
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )