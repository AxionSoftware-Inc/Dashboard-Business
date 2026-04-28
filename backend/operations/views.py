from rest_framework.viewsets import ModelViewSet

from operations.models import Debt, Transaction
from operations.serializers import DebtSerializer, TransactionSerializer


class TransactionViewSet(ModelViewSet):
    serializer_class = TransactionSerializer
    filterset_fields = ["business", "type", "payment_method"]
    search_fields = ["title", "linked_to", "note", "payment_method"]
    ordering_fields = ["happened_at", "amount", "created_at"]
    ordering = ["-happened_at", "-created_at"]

    def get_queryset(self):
        queryset = Transaction.objects.select_related("business")
        if self.request.user.is_authenticated:
            queryset = queryset.filter(business__owner=self.request.user)
        business_id = self.request.query_params.get("business")
        transaction_type = self.request.query_params.get("type")

        if business_id:
            queryset = queryset.filter(business_id=business_id)
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)

        return queryset


class DebtViewSet(ModelViewSet):
    serializer_class = DebtSerializer
    filterset_fields = ["business", "direction", "is_closed"]
    search_fields = ["contact_name", "note"]
    ordering_fields = ["due_date", "amount", "created_at"]
    ordering = ["is_closed", "due_date", "-created_at"]

    def get_queryset(self):
        queryset = Debt.objects.select_related("business")
        if self.request.user.is_authenticated:
            queryset = queryset.filter(business__owner=self.request.user)
        business_id = self.request.query_params.get("business")
        is_closed = self.request.query_params.get("is_closed")

        if business_id:
            queryset = queryset.filter(business_id=business_id)
        if is_closed in {"true", "false"}:
            queryset = queryset.filter(is_closed=is_closed == "true")

        return queryset

