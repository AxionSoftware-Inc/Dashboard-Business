from rest_framework import serializers

from catalog.models import Product


class ProductSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "business",
            "name",
            "category",
            "sku",
            "unit",
            "sale_price",
            "cost_price",
            "stock",
            "min_stock",
            "is_active",
            "is_low_stock",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "is_low_stock"]

    def get_is_low_stock(self, obj):
        return obj.stock <= obj.min_stock

    def validate_business(self, business):
        request = self.context.get("request")
        if request and request.user.is_authenticated and business.owner_id != request.user.id:
            raise serializers.ValidationError("You do not have access to this business.")
        return business
