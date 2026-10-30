
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from accounts.models import User
from rest_framework.test import APIRequestFactory
from accounts.views.user import UserListAPIView

from accounts.models.address import Address
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from django.core.cache import cache
from django.test import override_settings

class UserListPermissionTests(APITestCase):
    def setUp(self):
        self.url = reverse("user-list")

        self.regular_user = User.objects.create_user(
            username="regular_test_user",
            email="regular@example.com",
            password="TestPassword123!",
            phone_number="9876500001",
        )

        self.admin_user = User.objects.create_superuser(
            username="admin_test_user",
            email="admin@example.com",
            password="TestPassword123!",
            phone_number="9876500002",
        )

    def test_anonymous_user_cannot_list_users(self):
        response = self.client.get(self.url)

        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_regular_user_cannot_list_users(self):
        self.client.force_authenticate(user=self.regular_user)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_admin_can_list_users(self):
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_list_does_not_return_password_hashes(self):
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for user_data in response.data:
            self.assertNotIn("password", user_data)



class AddressOwnershipTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user_a = User.objects.create_user(
            username="address_user_a",
            email="addressa@example.com",
            password="TestPassword123!",
            phone_number="9876500011",
        )

        self.user_b = User.objects.create_user(
            username="address_user_b",
            email="addressb@example.com",
            password="TestPassword123!",
            phone_number="9876500012",
        )

        self.address_a = Address.objects.create(
            user=self.user_a,
            full_name="Customer A",
            phone_number="9876500011",
            address_line_1="10 Example Road",
            city="Kochi",
            state="Kerala",
            pincode="682001",
        )

        self.address_b = Address.objects.create(
            user=self.user_b,
            full_name="Customer B",
            phone_number="9876500012",
            address_line_1="20 Sample Street",
            city="Kochi",
            state="Kerala",
            pincode="682002",
        )

        self.list_url = reverse("address-list-create")

    def test_user_can_list_only_own_addresses(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.address_a.id)

    def test_user_cannot_retrieve_another_users_address(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.get(
            reverse("address-detail", args=[self.address_b.id])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_another_users_address(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.put(
            reverse("address-detail", args=[self.address_b.id]),
            {
                "full_name": "Modified Customer",
                "phone_number": "9876500099",
                "address_line_1": "New Road",
                "address_line_2": "",
                "city": "Kochi",
                "state": "Kerala",
                "pincode": "682003",
                "is_default": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.address_b.refresh_from_db()
        self.assertEqual(self.address_b.full_name, "Customer B")

    def test_user_cannot_delete_another_users_address(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.delete(
            reverse("address-detail", args=[self.address_b.id])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(
            Address.objects.filter(id=self.address_b.id).exists()
        )

    def test_created_address_belongs_to_authenticated_user(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.post(
            self.list_url,
            {
                "full_name": "New Customer",
                "phone_number": "9876500013",
                "address_line_1": "30 New Road",
                "address_line_2": "",
                "city": "Kochi",
                "state": "Kerala",
                "pincode": "682004",
                "is_default": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_address = Address.objects.get(id=response.data["id"])
        self.assertEqual(new_address.user, self.user_a)


class LogoutRefreshTokenTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="logout_test_user",
            email="logouttest@example.com",
            password="TestPassword123!",
            phone_number="9876500021",
        )

        self.logout_url = reverse("logout")
        self.refresh_url = reverse("token_refresh")

        self.refresh_token = str(
            RefreshToken.for_user(self.user)
        )

        self.client.force_authenticate(user=self.user)

    def test_logout_blacklists_refresh_token(self):
        response = self.client.post(
            self.logout_url,
            {"refresh": self.refresh_token},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        # The blacklisted refresh token must not be reusable.
        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": self.refresh_token},
            format="json",
        )

        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_logout_rejects_missing_refresh_token(self):
        response = self.client.post(
            self.logout_url,
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )



@override_settings(
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": (
            "rest_framework_simplejwt.authentication.JWTAuthentication",
        ),
        "DEFAULT_THROTTLE_RATES": {
            "login": "5/minute",
        },
    }
)
class LoginThrottleTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.url = "/api/auth/login/"

    def test_login_is_throttled_after_five_requests(self):
        for _ in range(5):
            response = self.client.post(
                self.url,
                {
                    "email": "unknown@example.com",
                    "password": "WrongPassword123!",
                },
                format="json",
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_400_BAD_REQUEST,
            )

        response = self.client.post(
            self.url,
            {
                "email": "unknown@example.com",
                "password": "WrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )

    def tearDown(self):
        cache.clear()
