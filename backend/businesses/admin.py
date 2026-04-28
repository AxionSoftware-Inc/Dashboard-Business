from django.contrib import admin

from businesses.models import Business


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ("name", "template", "currency", "starting_cash", "created_at")
    list_filter = ("template", "currency")
    search_fields = ("name", "owner_name")

# Register your models here.
