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

    def validate_name(self, value):
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError("Product name must be at least 2 characters.")
        return name

    def validate_sku(self, value):
        return value.strip()

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value

    def validate_min_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Minimum stock cannot be negative.")
        return value

    def validate_sale_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Sale price cannot be negative.")
        return value

    def validate_cost_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Cost price cannot be negative.")
        return value

    def validate_business(self, business):
        request = self.context.get("request")
        if request and business.owner_id != request.user.id:
            raise serializers.ValidationError("You do not have access to this business.")
        return business
