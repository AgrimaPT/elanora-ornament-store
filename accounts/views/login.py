
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle

from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiResponse
from accounts.serializers.login import LoginSerializer
from accounts.serializers.user import UserSerializer


class LoginResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    user = UserSerializer()
    access = serializers.CharField()
    refresh = serializers.CharField()


class LoginAPIView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    @extend_schema(
        request=LoginSerializer,
        responses={
            200: LoginResponseSerializer,
            400: OpenApiResponse(
                description="Invalid login credentials or validation error."
            ),
        },
        description="Authenticate a user and return JWT tokens.",
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            validated_data = serializer.validated_data

            return Response(
                {
                    "message": "Login successful.",
                    "user": UserSerializer(
                        validated_data["user"]
                    ).data,
                    "access": validated_data["access"],
                    "refresh": validated_data["refresh"],
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
