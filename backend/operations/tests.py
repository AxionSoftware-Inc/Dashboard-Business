from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from businesses.models import Business


class OperationApiTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="owner", password="TestPass12345")
        self.business = Business.objects.create(name="Shop", owner=self.user, template="minimarket")
        self.client.force_authenticate(self.user)

    def test_transaction_rejects_zero_amount(self):
        response = self.client.post(
            "/api/transactions/",
            {
                "business": self.business.id,
                "type": "sale",
                "title": "Sale",
                "amount": "0",
                "happened_at": "2026-05-17T12:00:00Z",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("amount", response.data)

    def test_debt_rejects_negative_amount(self):
        response = self.client.post(
            "/api/debts/",
            {
                "business": self.business.id,
                "contact_name": "Customer",
                "direction": "receivable",
                "amount": "-1000",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("amount", response.data)
