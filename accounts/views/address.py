from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers.address import AddressSerializer


class AddressListCreateAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        addresses = request.user.addresses.all()

        serializer = AddressSerializer(
            addresses,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = AddressSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        address = serializer.save()
          

        response_serializer = AddressSerializer(
            address
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )