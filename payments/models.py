from django.core.validators import MinValueValidator
from django.db import models

from orders.models import Order


class Payment(models.Model):

    class PaymentStatus(models.TextChoices):
        CREATED = "CREATED", "Created"
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"
        EXPIRED = "EXPIRED", "Expired"
        REFUNDED = "REFUNDED", "Refunded"

    order = models.OneToOneField(
        Order,
        on_delete=models.PROTECT,
        related_name="payment",
    )

    razorpay_order_id = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True,
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True,
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.CREATED,
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
    )


    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order.order_number} - {self.status}"

class WebhookEvent(models.Model):

    event_id = models.CharField(
        max_length=150,
        unique=True,
    )

    event_type = models.CharField(
        max_length=100,
    )

    received_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.event_type} - {self.event_id}"