from django.contrib import admin

from orders.models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = (
        "product",
        "variant",
        "quantity",
        "unit_price",
        "subtotal",
    )
    readonly_fields = (
        "unit_price",
        "subtotal",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "user",
        "order_status",
        "payment_status",
        "total_amount",
        "created_at",
    )

    search_fields = (
        "order_number",
        "user__email",
        "shipping_full_name",
        "shipping_phone_number",
    )

    list_filter = (
        "order_status",
        "payment_status",
        "created_at",
    )

    ordering = ("-created_at",)

    inlines = [OrderItemInline]