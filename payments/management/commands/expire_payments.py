
from django.core.management.base import BaseCommand
from django.utils import timezone

from payments.models import Payment
from payments.services import PaymentExpirationService


class Command(BaseCommand):
    help = "Expire unpaid payments and release reserved stock."

    def handle(self, *args, **options):
        now = timezone.now()

        payment_ids = list(
            Payment.objects.filter(
                status__in=[
                    Payment.PaymentStatus.CREATED,
                    Payment.PaymentStatus.PENDING,
                ],
                expires_at__isnull=False,
                expires_at__lte=now,
            ).values_list("id", flat=True)
        )

        expired_count = 0

        for payment_id in payment_ids:
            try:
                expired = PaymentExpirationService.expire_payment(
                    payment_id
                )
            except Payment.DoesNotExist:
                continue

            if expired:
                expired_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Expired payments processed: {expired_count}"
            )
        )
