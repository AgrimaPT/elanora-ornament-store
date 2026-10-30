
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Address, User
from orders.models import Order


class OrderSecurityTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="order_user_a",
            email="ordera@example.com",
            password="TestPassword123!",
            phone_number="9876500101",
        )

        self.user_b = User.objects.create_user(
            username="order_user_b",
            email="orderb@example.com",
            password="TestPassword123!",
            phone_number="9876500102",
        )

        self.address_a = Address.objects.create(
            user=self.user_a,
            full_name="Customer A",
            phone_number="9876500101",
            address_line_1="10 Example Road",
            city="Kochi",
            state="Kerala",
            pincode="682001",
        )

        self.address_b = Address.objects.create(
            user=self.user_b,
            full_name="Customer B",
            phone_number="9876500102",
            address_line_1="20 Sample Street",
            city="Kochi",
            state="Kerala",
            pincode="682002",
        )

        self.order_a = self.create_order(
            user=self.user_a,
            order_number="ORD-TEST-A001",
        )

        self.order_b = self.create_order(
            user=self.user_b,
            order_number="ORD-TEST-B001",
        )

    def create_order(self, user, order_number):
        return Order.objects.create(
            user=user,
            order_number=order_number,
            total_amount="100.00",
            shipping_full_name="Test Customer",
            shipping_phone_number=user.phone_number,
            shipping_address_line_1="Test Road",
            shipping_address_line_2="",
            shipping_city="Kochi",
            shipping_state="Kerala",
            shipping_pincode="682001",
        )

    def test_customer_can_view_own_order(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.get(
            reverse("order-detail", args=[self.order_a.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["order_number"],
            self.order_a.order_number,
        )

    def test_customer_cannot_view_another_customers_order(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.get(
            reverse("order-detail", args=[self.order_b.id])
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_customer_cannot_cancel_another_customers_order(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.post(
            reverse("cancel-order", args=[self.order_b.id])
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.order_b.refresh_from_db()

        self.assertEqual(
            self.order_b.order_status,
            Order.OrderStatus.PENDING,
        )

    def test_checkout_rejects_another_customers_address(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.post(
            reverse("place-order"),
            {"address_id": self.address_b.id},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertFalse(
            Order.objects.filter(
                user=self.user_a,
                shipping_full_name=self.address_b.full_name,
            ).exists()
        )



class OrderStatusPermissionTests(OrderSecurityTests):
    def test_customer_cannot_update_order_status(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.patch(
            reverse("update-order-status", args=[self.order_a.id]),
            {"order_status": Order.OrderStatus.CONFIRMED},
            format="json",
        )

        self.assertIn(response.status_code, [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN,
        ])

        self.order_a.refresh_from_db()
        self.assertEqual(
            self.order_a.order_status,
            Order.OrderStatus.PENDING,
        )

    def test_admin_cannot_skip_order_status_steps(self):
        admin = User.objects.create_superuser(
            username="order_test_admin",
            email="orderadmin@example.com",
            password="TestPassword123!",
            phone_number="9876500199",
        )

        self.client.force_authenticate(user=admin)

        response = self.client.patch(
            reverse("update-order-status", args=[self.order_a.id]),
            {"order_status": Order.OrderStatus.SHIPPED},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.order_a.refresh_from_db()
        self.assertEqual(
            self.order_a.order_status,
            Order.OrderStatus.PENDING,
        )
