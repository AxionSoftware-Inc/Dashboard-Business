from django.db import models


class Product(models.Model):
    business = models.ForeignKey("businesses.Business", on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=180)
    category = models.CharField(max_length=120, blank=True)
    sku = models.CharField(max_length=80, blank=True)
    unit = models.CharField(max_length=32, default="dona")
    sale_price = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    cost_price = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    stock = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    min_stock = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        unique_together = [("business", "sku")]

    def __str__(self):
        return self.name

# Create your models here.
