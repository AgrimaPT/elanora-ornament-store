
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

from django.core import mail
from unittest.mock import patch


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


class ChangePasswordTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="change_password_user",
            email="changepassword@example.com",
            password="TestPassword123!",
            phone_number="9876500031",
        )

        self.url = reverse("change-password")

    def test_user_can_change_password_successfully(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.url,
            {
                "old_password": "TestPassword123!",
                "new_password": "AnotherStrongPassword456!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(
            self.user.check_password("AnotherStrongPassword456!")
        )
        self.assertFalse(
            self.user.check_password("TestPassword123!")
        )

    def test_incorrect_old_password_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.url,
            {
                "old_password": "WrongPassword123!",
                "new_password": "AnotherStrongPassword456!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.user.refresh_from_db()
        self.assertTrue(
            self.user.check_password("TestPassword123!")
        )

    def test_weak_password_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.url,
            {
                "old_password": "TestPassword123!",
                "new_password": "12345678",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.user.refresh_from_db()
        self.assertTrue(
            self.user.check_password("TestPassword123!")
        )

    def test_same_password_is_rejected(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.url,
            {
                "old_password": "TestPassword123!",
                "new_password": "TestPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_unauthenticated_user_cannot_change_password(self):
        response = self.client.put(
            self.url,
            {
                "old_password": "TestPassword123!",
                "new_password": "AnotherStrongPassword456!",
            },
            format="json",
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
            ],
        )



    def test_password_change_blacklists_existing_refresh_tokens(self):
        refresh = RefreshToken.for_user(self.user)

        self.client.force_authenticate(user=self.user)

        response = self.client.put(
            self.url,
            {
                "old_password": "TestPassword123!",
                "new_password": "AnotherStrongPassword456!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(
            reverse("token_refresh"),
            {"refresh": str(refresh)},
            format="json",
        )

        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


class RegistrationLoginTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.register_url = reverse("api-register")
        self.login_url = reverse("api-login")

        self.registration_data = {
            "first_name": "Agrima",
            "last_name": "Test",
            "email": "newcustomer@example.com",
            "phone_number": "9876500041",
            "password": "StrongPassword!2026",
        }

        self.existing_user = User.objects.create_user(
            username="existing_customer",
            first_name="Existing",
            last_name="Customer",
            email="existing@example.com",
            phone_number="9876500042",
            password="ExistingStrong!2026",
        )

    def tearDown(self):
        cache.clear()

    def test_user_can_register_successfully(self):
        response = self.client.post(
            self.register_url,
            self.registration_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        user = User.objects.get(
            email="newcustomer@example.com"
        )

        self.assertTrue(
            user.check_password("StrongPassword!2026")
        )

        self.assertNotEqual(
            user.password,
            "StrongPassword!2026",
        )

        self.assertNotIn("password", response.data)

    def test_registration_rejects_duplicate_email(self):
        data = {
            **self.registration_data,
            "email": "existing@example.com",
        }

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_registration_rejects_duplicate_phone(self):
        data = {
            **self.registration_data,
            "phone_number": "9876500042",
        }

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_registration_rejects_invalid_phone_number(self):
        data = {
            **self.registration_data,
            "phone_number": "98765ABCDE",
        }

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_registration_rejects_weak_password(self):
        data = {
            **self.registration_data,
            "password": "12345678",
        }

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("password", response.data)

    def test_user_can_login_successfully(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@example.com",
                "password": "ExistingStrong!2026",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(
            response.data["user"]["email"],
            "existing@example.com",
        )

    def test_login_rejects_incorrect_password(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "existing@example.com",
                "password": "WrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_login_rejects_unknown_email(self):
        response = self.client.post(
            self.login_url,
            {
                "email": "unknown@example.com",
                "password": "SomeStrongPassword!2026",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend"
    )
    def test_registration_sends_welcome_email(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                self.register_url,
                self.registration_data,
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox), 1)

        email = mail.outbox[0]

        self.assertEqual(email.subject, "Welcome to ELANORA")
        self.assertEqual(email.to, ["newcustomer@example.com"])
        self.assertIn("Agrima", email.body)
        self.assertIn("ELANORA", email.body)

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend"
    )
    def test_registration_succeeds_if_welcome_email_fails(self):
        with patch(
            "accounts.views.register.send_mail",
            side_effect=Exception("SMTP connection failed"),
        ):
            with self.captureOnCommitCallbacks(execute=True):
                response = self.client.post(
                    self.register_url,
                    self.registration_data,
                    format="json",
                )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(
                email="newcustomer@example.com"
            ).exists()
        )
