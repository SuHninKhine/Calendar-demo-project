"""Seed demo appointment data for local development."""

from __future__ import annotations

from datetime import date, timedelta

from django.core.management.base import BaseCommand

from appointments.models import Appointment


class Command(BaseCommand):
    """Seed the database with demo appointments."""

    help = "Seed demo appointments for the dispatch dashboard."

    def add_arguments(self, parser) -> None:
        """Register CLI arguments."""
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing appointments before seeding.",
        )

    def handle(self, *args, **options) -> None:
        """Create demo appointments with a mix of assigned/unassigned entries."""
        if options.get("clear"):
            deleted, _ = Appointment.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} rows."))

        today = date.today()
        workers = [
            "EiEi",
            "Cherry",
            "Nina",
            "Kai",
            "Mei",
            "Ariana",
            "Zack",
            "Ivy",
            "Noah",
            "Lena",
        ]
        prefixes = ["13", "13", "13", "12", "09", "01", "15", "18", "20", "03", "05", "07"]
        slots = [
            Appointment.SlotChoices.MORNING,
            Appointment.SlotChoices.AFTERNOON,
            Appointment.SlotChoices.EVENING,
        ]
        names = [
            "Amy Tan",
            "Ben Lim",
            "Cheryl Ng",
            "Daniel Koh",
            "Esther Yeo",
            "Farah Noor",
            "Gerald Tan",
            "Hannah Lee",
            "Ian Lim",
            "Jia Hui",
            "Kiran Rao",
            "Lily Chan",
            "Marcus Ong",
            "Nora Lee",
            "Owen Teo",
            "Priya Das",
            "Quinn Low",
            "Rina Soh",
            "Sam Goh",
            "Tina Ho",
            "Uma Rai",
            "Victor Tan",
            "Wendy Lim",
            "Xavier Koh",
            "Yara Lee",
            "Zane Ong",
            "Alicia Ng",
            "Brandon Lee",
            "Cassandra Lim",
            "Darren Koh",
        ]

        demo_rows = []
        total_appointments = 60
        assigned_count = 35
        conflict_pairs = 6

        def build_row(idx: int, worker_name: str) -> dict:
            prefix = prefixes[idx % len(prefixes)]
            postal_code = f"{prefix}{(idx + 1):04d}"
            phone = f"9{(idx + 1000000):07d}"[-8:]
            appointment_date = today + timedelta(days=idx % 21)
            slot = slots[idx % len(slots)]
            status = (
                Appointment.StatusChoices.CONFIRMED
                if worker_name
                else Appointment.StatusChoices.REQUESTED
            )
            payment_id = (
                f"PAY-{1000 + idx}" if worker_name and idx % 4 == 0 else ""
            )
            return {
                "client_name": names[idx % len(names)],
                "phone": phone,
                "address": f"{idx + 10} Sample Road",
                "postal_code": postal_code,
                "date": appointment_date,
                "slot": slot,
                "worker_name": worker_name,
                "status": status,
                "payment_id": payment_id,
            }

        # Create conflict pairs so busy workers appear disabled in dropdowns.
        for idx in range(conflict_pairs):
            base_index = idx * 2
            conflict_date = today + timedelta(days=idx + 2)
            conflict_slot = slots[idx % len(slots)]
            worker_name = workers[idx % len(workers)]
            prefix = prefixes[idx % len(prefixes)]

            assigned_row = build_row(base_index, worker_name)
            assigned_row["date"] = conflict_date
            assigned_row["slot"] = conflict_slot
            assigned_row["postal_code"] = f"{prefix}{(base_index + 1):04d}"
            demo_rows.append(assigned_row)

            unassigned_row = build_row(base_index + 1, "")
            unassigned_row["date"] = conflict_date
            unassigned_row["slot"] = conflict_slot
            unassigned_row["postal_code"] = f"{prefix}{(base_index + 2):04d}"
            demo_rows.append(unassigned_row)

        current_assigned = conflict_pairs
        current_total = conflict_pairs * 2

        # Fill remaining assigned appointments.
        idx = current_total
        while current_assigned < assigned_count:
            demo_rows.append(build_row(idx, workers[idx % len(workers)]))
            current_assigned += 1
            idx += 1
            current_total += 1

        # Fill remaining unassigned appointments.
        while current_total < total_appointments:
            demo_rows.append(build_row(idx, ""))
            idx += 1
            current_total += 1

        Appointment.objects.bulk_create(
            [Appointment(**row) for row in demo_rows],
            ignore_conflicts=True,
        )

        self.stdout.write(
            self.style.SUCCESS(f"Seeded {len(demo_rows)} appointments.")
        )
