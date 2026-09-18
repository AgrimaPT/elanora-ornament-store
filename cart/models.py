from django.conf import settings
from django.db import models
from django.db.models import Q

from products.models import Product, ProductVariant

class Cart(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user}'s Cart"


class CartItem(models.Model):

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="cart_items",
    )

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="cart_items",
        null=True,
        blank=True,
    )

    quantity = models.PositiveIntegerField(
        default=1,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "cart",
                    "product",
                ],
                condition=Q(
                    variant__isnull=True
                ),
                name="unique_cart_product_without_variant",
            ),
            models.UniqueConstraint(
                fields=[
                    "cart",
                    "product",
                    "variant",
                ],
                condition=Q(
                    variant__isnull=False
                ),
                name="unique_cart_product_variant",
            ),
        ]