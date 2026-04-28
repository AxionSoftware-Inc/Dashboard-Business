from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from businesses.models import Business
from catalog.models import Product
from operations.models import Debt, Transaction


class Command(BaseCommand):
    help = "Create demo data for local frontend/backend integration."

    def handle(self, *args, **options):
        User = get_user_model()
        user, created = User.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@example.com", "first_name": "Demo"},
        )
        if created or not user.check_password("demo12345"):
            user.set_password("demo12345")
            user.save(update_fields=["password"])

        business, _ = Business.objects.update_or_create(
            name="Akmal Market",
            defaults={
                "owner": user,
                "owner_name": "Akmal aka",
                "template": Business.Template.MINIMARKET,
                "starting_cash": Decimal("2000000"),
                "payment_methods": ["Naqd", "Karta", "Click"],
            },
        )

        products = [
            ("Coca-Cola 1.5L", "Ichimlik", "COLA-15", 18, 10, 14000, 10000),
            ("Un 5kg", "Oziq-ovqat", "UN-5", 7, 12, 55000, 44000),
            ("Shakar 1kg", "Oziq-ovqat", "SHAKAR-1", 3, 10, 15000, 10000),
        ]

        for name, category, sku, stock, min_stock, sale_price, cost_price in products:
            Product.objects.update_or_create(
                business=business,
                sku=sku,
                defaults={
                    "name": name,
                    "category": category,
                    "stock": Decimal(stock),
                    "min_stock": Decimal(min_stock),
                    "sale_price": Decimal(sale_price),
                    "cost_price": Decimal(cost_price),
                },
            )

        now = timezone.now()
        transactions = [
            (Transaction.Type.SALE, "Chakana savdo", Decimal("4280000"), "Naqd + karta", "Ombor va foyda"),
            (Transaction.Type.EXPENSE, "Yetkazib beruvchi to'lovi", Decimal("-1750000"), "Bank", "Tannarx"),
            (Transaction.Type.INCOME, "Mijoz qarzi yopildi", Decimal("920000"), "Click", "Qarz daftari"),
        ]

        for trx_type, title, amount, method, linked_to in transactions:
            Transaction.objects.update_or_create(
                business=business,
                title=title,
                defaults={
                    "type": trx_type,
                    "amount": amount,
                    "payment_method": method,
                    "linked_to": linked_to,
                    "happened_at": now,
                },
            )

        Debt.objects.update_or_create(
            business=business,
            contact_name="Akmal market",
            defaults={
                "direction": Debt.Direction.RECEIVABLE,
                "amount": Decimal("2450000"),
                "is_closed": False,
            },
        )

        self.stdout.write(self.style.SUCCESS(f"Demo data ready for business id={business.id}"))
        self.stdout.write(self.style.SUCCESS("Demo login: username=demo password=demo12345"))
