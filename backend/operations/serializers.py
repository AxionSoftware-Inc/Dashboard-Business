from rest_framework import serializers

from operations.models import Debt, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "business",
            "type",
            "title",
            "amount",
            "payment_method",
            "linked_to",
            "note",
            "happened_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_title(self, value):
        title = value.strip()
        if len(title) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters.")
        return title

    def validate_amount(self, value):
        if value == 0:
            raise serializers.ValidationError("Amount cannot be zero.")
        return value

    def validate_business(self, business):
        request = self.context.get("request")
        if request and business.owner_id != request.user.id:
            raise serializers.ValidationError("You do not have access to this business.")
        return business


class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = [
            "id",
            "business",
            "contact_name",
            "direction",
            "amount",
            "due_date",
            "is_closed",
            "note",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_contact_name(self, value):
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError("Contact name must be at least 2 characters.")
        return name

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Debt amount must be greater than zero.")
        return value

    def validate_business(self, business):
        request = self.context.get("request")
        if request and business.owner_id != request.user.id:
            raise serializers.ValidationError("You do not have access to this business.")
        return business
