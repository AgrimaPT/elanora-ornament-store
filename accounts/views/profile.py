
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema

from accounts.serializers.user import UserSerializer


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: UserSerializer},
        description="Retrieve the authenticated user's profile.",
    )
    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
