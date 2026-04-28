from django.contrib import admin

from catalog.models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "business", "category", "stock", "min_stock", "sale_price", "is_active")
    list_filter = ("is_active", "category")
    search_fields = ("name", "sku", "category")

# Register your models here.
