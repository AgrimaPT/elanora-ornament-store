from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart, CartItem
from cart.serializers import (
    AddToCartSerializer,
    CartItemSerializer,
    CartSerializer,
    UpdateCartItemSerializer,
)

class CartAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(cart)

        return Response(serializer.data)
    
class AddToCartAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        serializer = AddToCartSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]


        # Get or create the user's cart
        cart, created = Cart.objects.get_or_create(
            user=request.user
        )


        try:

            cart_item = CartItem.objects.get(
                cart=cart,
                product=product
            )

            final_quantity = (
                cart_item.quantity + quantity
            )

        except CartItem.DoesNotExist:

            cart_item = None

            final_quantity = quantity


        # Check available stock
        if final_quantity > product.stock:

            return Response(
                {
                    "detail":
                    "Requested quantity exceeds available stock."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # Update existing cart item
        if cart_item:

            cart_item.quantity = final_quantity

            cart_item.save()


        # Create new cart item
        else:

            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=quantity
            )


        response_serializer = CartItemSerializer(
            cart_item
        )


        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class CartItemAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_cart_item(self, request, item_id):

        return get_object_or_404(
            CartItem,
            id=item_id,
            cart__user=request.user,
        )

    def patch(self, request, item_id):

        cart_item = self.get_cart_item(
            request,
            item_id
        )

        serializer = UpdateCartItemSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data["quantity"]

        if quantity > cart_item.product.stock:
            return Response(
                {
                    "detail":
                    "Requested quantity exceeds available stock."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        response_serializer = CartItemSerializer(
            cart_item
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, item_id):

        cart_item = self.get_cart_item(
            request,
            item_id
        )

        cart_item.delete()

        return Response(
            {
                "detail": "Item removed from cart."
            },
            status=status.HTTP_200_OK
        )
    

class CartAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(cart)

        return Response(serializer.data)

    def delete(self, request):

        cart = get_object_or_404(
            Cart,
            user=request.user,
        )

        cart.items.all().delete()

        return Response(
            {
                "detail": "Cart cleared successfully."
            },
            status=status.HTTP_200_OK
        )
    



from django.shortcuts import render

def cart_page(request):
    return render(
    request,
    "cart.html",
    )
