
from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
    BlacklistedToken,
)

from accounts.serializers.change_password import ChangePasswordSerializer


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"old_password": ["Old password is incorrect."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Change password and blacklist existing refresh tokens atomically.
        with transaction.atomic():
            user.set_password(new_password)
            user.save(update_fields=["password"])

            outstanding_tokens = OutstandingToken.objects.filter(
                user=user
            )

            for outstanding_token in outstanding_tokens:
                BlacklistedToken.objects.get_or_create(
                    token=outstanding_token
                )

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )
