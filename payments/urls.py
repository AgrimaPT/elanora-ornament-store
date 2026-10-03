from django.urls import path

from payments.views import CreatePaymentAPIView,VerifyPaymentAPIView,RazorpayWebhookAPIView


urlpatterns = [
    path(
        "create/",
        CreatePaymentAPIView.as_view(),
        name="create-payment",
    ),

    path(
        "verify/",
        VerifyPaymentAPIView.as_view(),
        name="verify-payment",
    ),

    path(
        "webhook/",
        RazorpayWebhookAPIView.as_view(),
        name="razorpay-webhook",
    ),
]