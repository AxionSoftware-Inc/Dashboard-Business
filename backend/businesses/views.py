from rest_framework.viewsets import ModelViewSet

from audits.models import AuditLog
from audits.services import write_audit_log
from businesses.models import Business
from businesses.serializers import BusinessSerializer


class BusinessViewSet(ModelViewSet):
    serializer_class = BusinessSerializer
    search_fields = ["name", "owner_name"]
    ordering_fields = ["created_at", "name", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Business.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        business = serializer.save(owner=self.request.user)
        write_audit_log(self.request, AuditLog.Action.CREATE, business, business.name)

    def perform_update(self, serializer):
        business = serializer.save(owner=self.request.user)
        write_audit_log(self.request, AuditLog.Action.UPDATE, business, business.name)

    def perform_destroy(self, instance):
        write_audit_log(self.request, AuditLog.Action.DELETE, instance, instance.name)
        instance.delete()
