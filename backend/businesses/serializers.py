from rest_framework import serializers

from businesses.models import Business

ALLOWED_PAYMENT_METHODS = {"Naqd", "Karta", "Click", "Payme", "Bank"}


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            "id",
            "name",
            "owner_name",
            "template",
            "currency",
            "starting_cash",
            "payment_methods",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_name(self, value):
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError("Business name must be at least 2 characters.")
        return name

    def validate_currency(self, value):
        currency = value.strip().upper()
        if currency != "UZS":
            raise serializers.ValidationError("Only UZS is supported right now.")
        return currency

    def validate_starting_cash(self, value):
        if value < 0:
            raise serializers.ValidationError("Starting cash cannot be negative.")
        return value

    def validate_payment_methods(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Payment methods must be a list.")
        cleaned = []
        for item in value:
            method = str(item).strip()
            if method and method in ALLOWED_PAYMENT_METHODS and method not in cleaned:
                cleaned.append(method)
        return cleaned
