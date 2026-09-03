from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers.login import LoginSerializer
from accounts.serializers.user import UserSerializer


class LoginAPIView(APIView):

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