from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from audits.models import AuditLog
from businesses.models import Business


class BusinessApiTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="owner", password="TestPass12345")
        self.other_user = User.objects.create_user(username="other", password="TestPass12345")

    def test_businesses_require_authentication(self):
        response = self.client.get("/api/businesses/")

        self.assertEqual(response.status_code, 401)

    def test_user_only_sees_own_businesses(self):
        own = Business.objects.create(name="Own business", owner=self.user, template="minimarket")
        Business.objects.create(name="Other business", owner=self.other_user, template="cafe")
        self.client.force_authenticate(self.user)

        response = self.client.get("/api/businesses/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], own.id)

    def test_create_business_writes_owner_and_audit_log(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            "/api/businesses/",
            {
                "name": "New shop",
                "template": "minimarket",
                "currency": "UZS",
                "starting_cash": "100000",
                "payment_methods": ["Naqd", "Karta", "Naqd", "Unknown"],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        business = Business.objects.get(id=response.data["id"])
        self.assertEqual(business.owner, self.user)
        self.assertEqual(business.payment_methods, ["Naqd", "Karta"])
        self.assertTrue(
            AuditLog.objects.filter(
                user=self.user,
                business=business,
                action=AuditLog.Action.CREATE,
                model_name="Business",
            ).exists()
        )

    def test_register_allows_simple_password(self):
        response = self.client.post(
            "/api/auth/register/",
            {"username": "998901234567", "password": "1"},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
