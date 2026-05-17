from rest_framework.viewsets import ModelViewSet
from decimal import Decimal, InvalidOperation

from rest_framework.decorators import action
from rest_framework.response import Response
from audits.mixins import AuditModelViewSetMixin
from audits.models import AuditLog
from audits.services import write_audit_log

from catalog.models import Product
from catalog.serializers import ProductSerializer


class ProductViewSet(AuditModelViewSetMixin, ModelViewSet):
    serializer_class = ProductSerializer
    filterset_fields = ["business", "category", "is_active"]
    search_fields = ["name", "sku", "category"]
    ordering_fields = ["name", "stock", "sale_price", "created_at"]
    ordering = ["name"]

    def get_queryset(self):
        queryset = Product.objects.select_related("business")
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
            delta_value = Decimal(str(delta))
        except (InvalidOperation, TypeError, ValueError):
            return Response({"detail": "delta must be a valid number"}, status=400)

        next_stock = product.stock + delta_value
        if next_stock < 0:
            return Response({"detail": "stock cannot become negative"}, status=400)

        product.stock = next_stock
        product.save(update_fields=["stock", "updated_at"])
        write_audit_log(request, AuditLog.Action.UPDATE, product, f"Stock adjusted by {delta}")
        return Response(self.get_serializer(product).data)
