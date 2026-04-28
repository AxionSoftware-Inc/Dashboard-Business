from rest_framework import serializers

from businesses.models import Business


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
