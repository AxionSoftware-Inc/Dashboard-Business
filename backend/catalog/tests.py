from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from businesses.models import Business
from catalog.models import Product


class ProductApiTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="owner", password="TestPass12345")
        self.business = Business.objects.create(name="Shop", owner=self.user, template="minimarket")
        self.client.force_authenticate(self.user)

    def test_product_rejects_negative_values(self):
        response = self.client.post(
            "/api/products/",
            {
                "business": self.business.id,
                "name": "Cola",
                "stock": "-1",
                "min_stock": "0",
                "sale_price": "1000",
                "cost_price": "800",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("stock", response.data)

    def test_stock_adjust_cannot_make_stock_negative(self):
        product = Product.objects.create(business=self.business, name="Cola", stock=1)

        response = self.client.post(f"/api/products/{product.id}/adjust_stock/", {"delta": "-2"}, format="json")

        self.assertEqual(response.status_code, 400)
        product.refresh_from_db()
        self.assertEqual(product.stock, 1)
