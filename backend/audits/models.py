from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    class Action(models.TextChoices):
        CREATE = "create", "Create"
        UPDATE = "update", "Update"
        DELETE = "delete", "Delete"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    business = models.ForeignKey("businesses.Business", on_delete=models.SET_NULL, blank=True, null=True)
    action = models.CharField(max_length=16, choices=Action.choices)
    model_name = models.CharField(max_length=80)
    object_id = models.CharField(max_length=64, blank=True)
    summary = models.CharField(max_length=240, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["business", "-created_at"]),
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["model_name", "object_id"]),
        ]

    def __str__(self):
        return f"{self.action} {self.model_name} #{self.object_id}"
