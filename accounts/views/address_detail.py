
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema

from accounts.models import Address
from accounts.serializers.address import AddressSerializer


class AddressDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @extend_schema(
        responses={200: AddressSerializer}
    )
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

    @extend_schema(
        request=AddressSerializer,
        responses={200: AddressSerializer}
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

    @extend_schema(
        responses={
            200: {
                "type": "object",
                "properties": {
                    "detail": {"type": "string"}
                }
            }
        }
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
