from django.shortcuts import render
from products.models import Category
import logging

from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle
from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)


def home(request):
    categories = Category.objects.filter(
        is_active=True
    ).order_by("name")

    return render(
        request,
        "home.html",
        {
            "categories": categories,
        },
    )


def shop(request):
    return render(request, "products/shop.html")


def checkout(request):
    return render(request, "checkout.html")




class ContactMessageCreateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"


    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the enquiry to the database first.
        contact_message = serializer.save()

        recipient = getattr(
            settings,
            "CONTACT_RECEIVER_EMAIL",
            "",
        )

        if not recipient:
            logger.error(
                "CONTACT_RECEIVER_EMAIL is not configured."
            )

            return Response(
                {
                    "message": (
                        "Your enquiry was saved, but we couldn't "
                        "send the email notification. Please contact "
                        "us directly if your enquiry is urgent."
                    ),
                    "email_sent": False,
                },
                status=status.HTTP_201_CREATED,
            )

        try:
            email = EmailMessage(
                subject=(
                    f"ELANORA Contact Enquiry: "
                    f"{contact_message.subject}"
                ),
                body=(
                    f"Name: {contact_message.name}\n"
                    f"Email: {contact_message.email}\n"
                    f"Subject: {contact_message.subject}\n\n"
                    f"Message:\n{contact_message.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
                reply_to=[contact_message.email],
            )

            email.send(fail_silently=False)

        except Exception:
            logger.exception(
                "Email failed for contact message %s",
                contact_message.pk,
            )

            return Response(
                {
                    "message": (
                        "Your enquiry was saved, but we couldn't "
                        "send the email notification. Please try "
                        "again later if you don't hear from us."
                    ),
                    "email_sent": False,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": (
                    "Thank you for contacting ELANORA. "
                    "We'll get back to you soon."
                ),
                "email_sent": True,
            },
            status=status.HTTP_201_CREATED,
        )
