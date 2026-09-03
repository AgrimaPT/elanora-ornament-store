from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.serializers.logout import LogoutSerializer


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)

        if serializer.is_valid():
            refresh = serializer.validated_data["refresh"]

            try:
                token = RefreshToken(refresh)   ##check whether the token is a valid JWT.
                token.blacklist()

                return Response(
                    {"message": "Logged out successfully."},
                    status=status.HTTP_200_OK,
                )

            except TokenError:
                return Response(
                    {"error": "Invalid or expired refresh token."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )