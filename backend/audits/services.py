from audits.models import AuditLog


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def resolve_business(instance):
    if instance.__class__.__name__ == "Business":
        return instance
    return getattr(instance, "business", None)


def write_audit_log(request, action, instance, summary=""):
    user = request.user if request.user.is_authenticated else None
    AuditLog.objects.create(
        user=user,
        business=resolve_business(instance),
        action=action,
        model_name=instance.__class__.__name__,
        object_id=str(getattr(instance, "pk", "")),
        summary=summary[:240],
        ip_address=get_client_ip(request),
    )
