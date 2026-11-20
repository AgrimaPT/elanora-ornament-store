
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.template.loader import render_to_string

from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse

from accounts.serializers import RegisterSerializer


logger = logging.getLogger(__name__)


class RegisterResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


def send_welcome_email(user, store_url):
    """Send a welcome email without affecting successful registration."""

    try:
        message = render_to_string(
            "emails/welcome_email.txt",
            {
                "first_name": user.first_name,
                "store_url": store_url,
            },
        )

        send_mail(
            subject="Welcome to ELANORA",
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

    except Exception:
        logger.exception(
            "Failed to send welcome email to %s",
            user.email,
        )


class RegisterAPIView(APIView):

    @extend_schema(
        request=RegisterSerializer,
        responses={
            201: RegisterResponseSerializer,
            400: OpenApiResponse(
                description="Registration validation errors."
            ),
        },
        description="Register a new user and send a welcome email.",
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            store_url = request.build_absolute_uri("/")

            transaction.on_commit(
                lambda: send_welcome_email(user, store_url)
            )

            return Response(
                {
                    "message": "User registered successfully."
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
