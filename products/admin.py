from django.contrib import admin
from django.utils.html import format_html
from products.models import Category,Product,ProductImage,ProductVariant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "slug",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    ordering = (
        "name",
    )

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

    readonly_fields = ("image_preview",) #admin-only field.It isn't a database field and shouldn't be editable or saved.

    fields = (
        "image",
        "image_preview",
        "order",
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="100" height="100" style="object-fit: cover;" />',
                obj.image.url,
            )

        return "No Image"

    image_preview.short_description = "Preview"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "is_active",
        "is_featured",
        "created_at",
    )

    list_filter = (
        "category",
        "is_active",
        "is_featured",
    )

    search_fields = (
        "name",
        "slug",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    list_editable = (
        "price",
        "stock",
        "is_active",
        "is_featured",
    )

    ordering = (
        "name",
    )

    list_select_related = (
        "category",
    )

    inlines = [ProductImageInline]

admin.site.register(ProductVariant)