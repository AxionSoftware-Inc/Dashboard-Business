from audits.models import AuditLog
from audits.services import write_audit_log


class AuditModelViewSetMixin:
    def perform_create(self, serializer):
        instance = serializer.save()
        write_audit_log(self.request, AuditLog.Action.CREATE, instance, str(instance))

    def perform_update(self, serializer):
        instance = serializer.save()
        write_audit_log(self.request, AuditLog.Action.UPDATE, instance, str(instance))

    def perform_destroy(self, instance):
        write_audit_log(self.request, AuditLog.Action.DELETE, instance, str(instance))
        instance.delete()
