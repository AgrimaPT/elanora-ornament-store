
import uuid
from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from orders.models import Order, OrderItem
from orders.serializers import (
    PlaceOrderSerializer,
    OrderSerializer,
    UpdateOrderStatusSerializer,
)
from products.models import Product, ProductVariant


class PlaceOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # ---------------------------------------------------------
        # 1. Validate the request data
        # ---------------------------------------------------------
        serializer = PlaceOrderSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        address = serializer.validated_data["address_id"]

        # ---------------------------------------------------------
        # 2. Start database transaction
        # ---------------------------------------------------------
        with transaction.atomic():

            # -----------------------------------------------------
            # 3. Lock the user's cart
            # -----------------------------------------------------
            cart = Cart.objects.select_for_update().filter(
                user=request.user
            ).first()

            if not cart:
                return Response(
                    {"detail": "Cart is empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not cart.items.exists():
                return Response(
                    {"detail": "Cart is empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # -----------------------------------------------------
            # 4. Get cart items in consistent order
            # -----------------------------------------------------
            cart_items = cart.items.select_related(
                "product",
                "variant",
            ).order_by(
                "product_id",
                "variant_id",
                "id",
            )

            total_amount = Decimal("0.00")
            validated_items = []

            # -----------------------------------------------------
            # 5. Validate products, variants, stock and prices
            # -----------------------------------------------------
            for cart_item in cart_items:

                # Lock the current product row
                product = Product.objects.select_for_update().get(
                    pk=cart_item.product_id
                )

                # -------------------------------------------------
                # 6. Check product availability
                # -------------------------------------------------
                if not product.is_active:
                    return Response(
                        {
                            "detail": (
                                f"{product.name} is no longer "
                                "available."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # -------------------------------------------------
                # 7. Lock variant if the cart item has one
                # -------------------------------------------------
                variant = None

                if cart_item.variant_id:
                    variant = (
                        ProductVariant.objects
                        .select_for_update()
                        .get(pk=cart_item.variant_id)
                    )

                    # Make sure the variant belongs to this product
                    if variant.product_id != product.id:
                        return Response(
                            {
                                "detail": (
                                    f"Invalid variant for "
                                    f"{product.name}."
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    # Check variant availability
                    if not variant.is_active:
                        return Response(
                            {
                                "detail": (
                                    f"{product.name} variant "
                                    "is no longer available."
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                # -------------------------------------------------
                # 8. Determine current available stock
                # -------------------------------------------------
                available_stock = (
                    variant.stock
                    if variant
                    else product.stock
                )

                # -------------------------------------------------
                # 9. Validate current stock
                # -------------------------------------------------
                if cart_item.quantity > available_stock:
                    return Response(
                        {
                            "detail": (
                                f"Insufficient stock for "
                                f"{product.name}."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # -------------------------------------------------
                # 10. Determine authoritative current price
                # -------------------------------------------------
                unit_price = (
                    variant.price
                    if variant and variant.price is not None
                    else product.price
                )

                # -------------------------------------------------
                # 11. Calculate item subtotal
                # -------------------------------------------------
                subtotal = unit_price * cart_item.quantity

                total_amount += subtotal

                # Store validated information for later
                validated_items.append(
                    {
                        "product": product,
                        "variant": variant,
                        "quantity": cart_item.quantity,
                        "unit_price": unit_price,
                        "subtotal": subtotal,
                    }
                )

            # -----------------------------------------------------
            # 12. Generate unique order number
            # -----------------------------------------------------
            order_number = (
                f"ORD-{uuid.uuid4().hex[:8].upper()}"
            )

            # -----------------------------------------------------
            # 13. Create Order
            # -----------------------------------------------------
            order = Order.objects.create(
                user=request.user,
                order_number=order_number,
                total_amount=total_amount,
                shipping_full_name=address.full_name,
                shipping_phone_number=address.phone_number,
                shipping_address_line_1=address.address_line_1,
                shipping_address_line_2=address.address_line_2,
                shipping_city=address.city,
                shipping_state=address.state,
                shipping_pincode=address.pincode,
            )

            # -----------------------------------------------------
            # 14. Create OrderItems
            # -----------------------------------------------------
            for item in validated_items:
                OrderItem.objects.create(
                    order=order,
                    product=item["product"],
                    variant=item["variant"],
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    subtotal=item["subtotal"],
                )

            # -----------------------------------------------------
            # 15. Reduce stock
            # -----------------------------------------------------
            for item in validated_items:

                if item["variant"]:
                    item["variant"].stock -= item["quantity"]

                    item["variant"].save(
                        update_fields=["stock"]
                    )

                else:
                    item["product"].stock -= item["quantity"]

                    item["product"].save(
                        update_fields=["stock"]
                    )
                    
            # -----------------------------------------------------
            # 16. Clear cart after successful order creation
            # -----------------------------------------------------
            cart.items.all().delete()


        # ---------------------------------------------------------
        # 17. Return the created order
        # ---------------------------------------------------------
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class OrderListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)



class OrderDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(
                id=pk,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class CancelOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # ---------------------------------------------------------
        # 1. Find the order belonging to the authenticated user
        # ---------------------------------------------------------
        try:
            order = Order.objects.get(
                id=pk,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ---------------------------------------------------------
        # 2. Check whether the order can be cancelled
        # ---------------------------------------------------------
        cancellable_statuses = {
            Order.OrderStatus.PENDING,
            Order.OrderStatus.CONFIRMED,
        }

        if order.order_status not in cancellable_statuses:
            return Response(
                {
                    "detail": (
                        "This order cannot be cancelled "
                        "in its current status."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---------------------------------------------------------
        # 3. Start database transaction
        # ---------------------------------------------------------
        with transaction.atomic():

            # Re-fetch and lock the order
            order = (
                Order.objects
                .select_for_update()
                .get(
                    id=pk,
                    user=request.user,
                )
            )

            # -----------------------------------------------------
            # 4. Check status again after acquiring the lock
            # -----------------------------------------------------
            if order.order_status not in cancellable_statuses:
                return Response(
                    {
                        "detail": (
                            "This order cannot be cancelled "
                            "in its current status."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # -----------------------------------------------------
            # 5. Get order items
            # -----------------------------------------------------
            order_items = order.items.select_related(
                "product",
                "variant",
            )

            # -----------------------------------------------------
            # 6. Restore stock
            # -----------------------------------------------------
            for order_item in order_items:

                if order_item.variant_id:

                    variant = (
                        ProductVariant.objects
                        .select_for_update()
                        .get(
                            pk=order_item.variant_id
                        )
                    )

                    variant.stock += order_item.quantity

                    variant.save(
                        update_fields=["stock"]
                    )

                else:

                    product = (
                        Product.objects
                        .select_for_update()
                        .get(
                            pk=order_item.product_id
                        )
                    )

                    product.stock += order_item.quantity

                    product.save(
                        update_fields=["stock"]
                    )

            # -----------------------------------------------------
            # 7. Mark order as cancelled
            # -----------------------------------------------------
            order.order_status = Order.OrderStatus.CANCELLED

            order.save(
                update_fields=[
                    "order_status",
                    "updated_at",
                ]
            )

        # ---------------------------------------------------------
        # 8. Return updated order
        # ---------------------------------------------------------
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK,
        )
    

class UpdateOrderStatusAPIView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UpdateOrderStatusSerializer(
            data=request.data,
            context={"order": order},
        )

        serializer.is_valid(raise_exception=True)

        order.order_status = serializer.validated_data[
            "order_status"
        ]

        order.save(
            update_fields=[
                "order_status",
                "updated_at",
            ]
        )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK,
        )
    

from django.shortcuts import render


def orders_page(request):
    return render(
        request,
        "orders.html",
    )

def order_detail_page(request, pk):
    return render(
        request,
        "order_detail.html",
        {
            "order_id": pk,
        },
    )