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

    def validate_business(self, business):
        request = self.context.get("request")
        if request and request.user.is_authenticated and business.owner_id != request.user.id:
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

    def validate_business(self, business):
        request = self.context.get("request")
        if request and request.user.is_authenticated and business.owner_id != request.user.id:
            raise serializers.ValidationError("You do not have access to this business.")
        return business
