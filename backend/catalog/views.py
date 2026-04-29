from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

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

    @action(detail=True, methods=["post"])
    def adjust_stock(self, request, pk=None):
        product = self.get_object()
        delta = request.data.get("delta")
        try:
            product.stock = product.stock + type(product.stock)(delta)
        except Exception:
            return Response({"detail": "delta must be a valid number"}, status=400)

        product.save(update_fields=["stock", "updated_at"])
        return Response(self.get_serializer(product).data)
