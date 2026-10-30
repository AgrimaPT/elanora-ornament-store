
from django.core.management.base import BaseCommand

from payments.models import Payment
from payments.services import LateCaptureRefundService


class Command(BaseCommand):
    help = (
        "Reconcile uncertain or in-progress refunds "
        "without creating new refund requests."
    )

    def handle(self, *args, **options):
        payment_ids = list(
            Payment.objects.filter(
                refund_status__in=[
                    Payment.RefundStatus.PROCESSING,
                    Payment.RefundStatus.UNKNOWN,
                ],
            ).values_list("id", flat=True)
        )

        if not payment_ids:
            self.stdout.write(
                self.style.SUCCESS(
                    "Refunds requiring reconciliation: 0"
                )
            )
            return

        checked_count = 0
        resolved_count = 0
        unresolved_count = 0
        error_count = 0

        for payment_id in payment_ids:
            try:
                result = (
                    LateCaptureRefundService.reconcile_refund(
                        payment_id
                    )
                )
                checked_count += 1

                if result in [
                    Payment.RefundStatus.REFUNDED,
                    Payment.RefundStatus.FAILED,
                ]:
                    resolved_count += 1
                else:
                    unresolved_count += 1

            except Exception as exc:
                error_count += 1
                self.stderr.write(
                    self.style.WARNING(
                        f"Could not reconcile payment "
                        f"{payment_id}: {type(exc).__name__}: {exc}"
                    )
                )

        self.stdout.write(
            f"Refunds checked: {checked_count}"
        )
        self.stdout.write(
            f"Resolved: {resolved_count}"
        )
        self.stdout.write(
            f"Still unresolved: {unresolved_count}"
        )
        self.stdout.write(
            f"Errors: {error_count}"
        )
