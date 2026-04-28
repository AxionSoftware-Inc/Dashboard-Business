from django.contrib import admin

from operations.models import Debt, Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("title", "business", "type", "amount", "payment_method", "happened_at")
    list_filter = ("type", "payment_method")
    search_fields = ("title", "linked_to", "note")


@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    list_display = ("contact_name", "business", "direction", "amount", "due_date", "is_closed")
    list_filter = ("direction", "is_closed")
    search_fields = ("contact_name", "note")

# Register your models here.
