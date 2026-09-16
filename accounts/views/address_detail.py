from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address
from accounts.serializers.address import AddressSerializer


class AddressDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, address_id):

        address = get_object_or_404(
            Address,
            id=address_id,
            user=request.user,
        )

        serializer = AddressSerializer(
            address
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    
    def put(self, request, address_id):

        address = get_object_or_404(
            Address,
            id=address_id,
            user=request.user,
        )

        serializer = AddressSerializer(
            address,
            data=request.data,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    
    def delete(self, request, address_id):

        address = get_object_or_404(
            Address,
            id=address_id,
            user=request.user,
        )

        address.delete()

        return Response(
            {
                "detail": "Address deleted successfully."
            },
            status=status.HTTP_200_OK
        )