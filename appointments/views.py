"""API views for appointment resources."""

from typing import Any

from rest_framework import filters, viewsets

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    """CRUD API for appointments with postal prefix filtering."""

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["^postal_code"]

    def get_queryset(self) -> Any:
        """Optionally filter appointments by postal code prefix."""
        queryset = super().get_queryset()
        prefix = self.request.query_params.get("postal_prefix")
        if prefix:
            return queryset.filter(postal_code__startswith=prefix)
        return queryset
