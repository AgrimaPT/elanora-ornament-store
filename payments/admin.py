from django.contrib import admin

from payments.models import Payment, WebhookEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "amount",
        "status",
        "razorpay_order_id",
        "razorpay_payment_id",
        "created_at",
        "expires_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "order__order_number",
        "razorpay_order_id",
        "razorpay_payment_id",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):

    list_display = (
        "event_id",
        "event_type",
        "received_at",
    )

    list_filter = (
        "event_type",
        "received_at",
    )

    search_fields = (
        "event_id",
        "event_type",
    )

    readonly_fields = (
        "received_at",
    )