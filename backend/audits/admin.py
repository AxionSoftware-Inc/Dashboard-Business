from django.contrib import admin

from audits.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "user", "business", "action", "model_name", "object_id", "summary")
    list_filter = ("action", "model_name", "created_at")
    search_fields = ("summary", "object_id", "business__name", "user__username")
    readonly_fields = ("created_at",)
