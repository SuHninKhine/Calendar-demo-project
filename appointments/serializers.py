"""Serializers for appointment resources."""

from rest_framework import serializers

from .models import Appointment
from .services import get_district_from_postal


class AppointmentSerializer(serializers.ModelSerializer):
    """Serialize appointment data with computed district."""

    district = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "client_name",
            "phone",
            "address",
            "postal_code",
            "date",
            "slot",
            "created_at",
            "updated_at",
            "district",
        ]

    def get_district(self, obj: Appointment) -> str:
        """Return the postal district derived from the postal code."""
        return get_district_from_postal(obj.postal_code)
