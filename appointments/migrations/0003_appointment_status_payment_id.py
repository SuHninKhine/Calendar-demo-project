from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("appointments", "0002_appointment_worker_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="appointment",
            name="status",
            field=models.CharField(
                choices=[
                    ("requested", "Requested"),
                    ("confirmed", "Confirmed"),
                    ("done", "Done"),
                ],
                default="requested",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="appointment",
            name="payment_id",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
    ]
