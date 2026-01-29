"""Validation helpers for appointment data."""

from django.core.validators import RegexValidator


validate_phone = RegexValidator(
    regex=r"^[689]\d{7}$",
    message="Phone number must be 8 digits and start with 6, 8, or 9.",
)

validate_postal_code = RegexValidator(
    regex=r"^\d{6}$",
    message="Postal code must be exactly 6 digits.",
)
