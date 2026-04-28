from django.conf import settings
from django.db import models


class Business(models.Model):
    class Template(models.TextChoices):
        MINIMARKET = "minimarket", "Minimarket"
        CAFE = "cafe", "Kafe"
        SERVICE = "service", "Servis"
        WHOLESALE = "wholesale", "Ulgurji savdo"

    name = models.CharField(max_length=180)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    owner_name = models.CharField(max_length=180, blank=True)
    template = models.CharField(max_length=32, choices=Template.choices, default=Template.MINIMARKET)
    currency = models.CharField(max_length=8, default="UZS")
    starting_cash = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    payment_methods = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

# Create your models here.
