from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers.user import UserSerializer


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)    ###request.user is actually a User model instance representing that user.That's why we can simply write:UserSerializer(request.user).We don't need to query the database ourselves.

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )