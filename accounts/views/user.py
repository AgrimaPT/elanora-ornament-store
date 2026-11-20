
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema

from accounts.models import User
from accounts.serializers import UserSerializer


class UserListAPIView(APIView):
    permission_classes = [IsAdminUser]

    @extend_schema(
        responses={200: UserSerializer(many=True)},
        description="Retrieve all users. Admin access required.",
    )
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
