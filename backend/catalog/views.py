from rest_framework.viewsets import ModelViewSet

from catalog.models import Product
from catalog.serializers import ProductSerializer


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    filterset_fields = ["business", "category", "is_active"]
    search_fields = ["name", "sku", "category"]
    ordering_fields = ["name", "stock", "sale_price", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        queryset = Product.objects.select_related("business")
        if self.request.user.is_authenticated:
            queryset = queryset.filter(business__owner=self.request.user)
        business_id = self.request.query_params.get("business")
        if business_id:
            queryset = queryset.filter(business_id=business_id)
        return queryset
