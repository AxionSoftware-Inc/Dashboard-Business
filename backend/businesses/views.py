from rest_framework.viewsets import ModelViewSet

from businesses.models import Business
from businesses.serializers import BusinessSerializer


class BusinessViewSet(ModelViewSet):
    serializer_class = BusinessSerializer
    search_fields = ["name", "owner_name"]
    ordering_fields = ["created_at", "name", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Business.objects.filter(owner=self.request.user)
        return Business.objects.all()

    def perform_create(self, serializer):
        owner = self.request.user if self.request.user.is_authenticated else None
        serializer.save(owner=owner)
