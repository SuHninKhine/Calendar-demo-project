from django.db import models

from .validators import validate_phone, validate_postal_code


class Appointment(models.Model):
    """Represents a client appointment booking."""

    class SlotChoices(models.TextChoices):
        """Available appointment slots."""

        MORNING = "MORNING", "Morning"
        AFTERNOON = "AFTERNOON", "Afternoon"
        EVENING = "EVENING", "Evening"

    client_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=8, validators=[validate_phone])
    address = models.TextField()
    postal_code = models.CharField(max_length=6, validators=[validate_postal_code])
    date = models.DateField()
    slot = models.CharField(max_length=10, choices=SlotChoices.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "slot"]

    def __str__(self) -> str:
        """Return a readable identifier for the appointment."""
        return f"{self.client_name} - {self.date} {self.slot}"
