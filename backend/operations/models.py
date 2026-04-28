from django.db import models


class Transaction(models.Model):
    class Type(models.TextChoices):
        SALE = "sale", "Savdo"
        INCOME = "income", "Kirim"
        EXPENSE = "expense", "Chiqim"
        DEBT = "debt", "Qarz"
        INVENTORY = "inventory", "Ombor"

    business = models.ForeignKey("businesses.Business", on_delete=models.CASCADE, related_name="transactions")
    type = models.CharField(max_length=32, choices=Type.choices)
    title = models.CharField(max_length=180)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    payment_method = models.CharField(max_length=80, blank=True)
    linked_to = models.CharField(max_length=120, blank=True)
    note = models.TextField(blank=True)
    happened_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-happened_at", "-created_at"]

    def __str__(self):
        return f"{self.title} - {self.amount}"


class Debt(models.Model):
    class Direction(models.TextChoices):
        RECEIVABLE = "receivable", "Olinadigan"
        PAYABLE = "payable", "Beriladigan"

    business = models.ForeignKey("businesses.Business", on_delete=models.CASCADE, related_name="debts")
    contact_name = models.CharField(max_length=180)
    direction = models.CharField(max_length=20, choices=Direction.choices)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    due_date = models.DateField(blank=True, null=True)
    is_closed = models.BooleanField(default=False)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["is_closed", "due_date", "-created_at"]

    def __str__(self):
        return f"{self.contact_name} - {self.amount}"

# Create your models here.
