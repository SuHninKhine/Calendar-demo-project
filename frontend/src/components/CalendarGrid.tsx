import { Fragment } from 'react'
import type { Appointment, TimeSlot } from '../types/appointment'
import CalendarCell from './CalendarCell'

type CalendarDay = {
  label: string
  date: string
}

const calendarDays: CalendarDay[] = [
  { label: 'Mon', date: '2026-02-02' },
  { label: 'Tue', date: '2026-02-03' },
  { label: 'Wed', date: '2026-02-04' },
  { label: 'Thu', date: '2026-02-05' },
  { label: 'Fri', date: '2026-02-06' },
  { label: 'Sat', date: '2026-02-07' },
  { label: 'Sun', date: '2026-02-08' },
]

const slotLabels: { slot: TimeSlot; label: string }[] = [
  { slot: 'MORNING', label: 'Morning' },
  { slot: 'AFTERNOON', label: 'Afternoon' },
  { slot: 'EVENING', label: 'Evening' },
]

const dummyAppointments: Appointment[] = [
  {
    id: 1,
    client_name: 'John Tan',
    phone: '91234567',
    address: '123 Orchard Road',
    postal_code: '238858',
    date: '2026-02-03',
    slot: 'MORNING',
    district: 'Orchard/River Valley',
    created_at: '2026-01-29T10:00:00Z',
    updated_at: '2026-01-29T10:00:00Z',
  },
  {
    id: 2,
    client_name: 'Aisha Lim',
    phone: '81234567',
    address: '22 East Coast Road',
    postal_code: '428851',
    date: '2026-02-04',
    slot: 'AFTERNOON',
    district: 'Katong/Marine Parade',
    created_at: '2026-01-29T11:00:00Z',
    updated_at: '2026-01-29T11:00:00Z',
  },
  {
    id: 3,
    client_name: 'Marcus Ong',
    phone: '61234567',
    address: '88 Toa Payoh Central',
    postal_code: '319883',
    date: '2026-02-05',
    slot: 'EVENING',
    district: 'Balestier/Toa Payoh',
    created_at: '2026-01-29T12:00:00Z',
    updated_at: '2026-01-29T12:00:00Z',
  },
  {
    id: 4,
    client_name: 'Cheryl Ng',
    phone: '92345678',
    address: '14 Serangoon North Ave',
    postal_code: '555987',
    date: '2026-02-06',
    slot: 'MORNING',
    district: 'Serangoon/Hougang',
    created_at: '2026-01-29T13:00:00Z',
    updated_at: '2026-01-29T13:00:00Z',
  },
  {
    id: 5,
    client_name: 'Daniel Koh',
    phone: '98765432',
    address: '5 Pasir Ris Drive',
    postal_code: '510555',
    date: '2026-02-07',
    slot: 'AFTERNOON',
    district: 'Pasir Ris/Simei',
    created_at: '2026-01-29T14:00:00Z',
    updated_at: '2026-01-29T14:00:00Z',
  },
  {
    id: 6,
    client_name: 'Sophia Lee',
    phone: '81239876',
    address: '1 Marina Boulevard',
    postal_code: '018989',
    date: '2026-02-08',
    slot: 'EVENING',
    district: 'Raffles Place/Marina',
    created_at: '2026-01-29T15:00:00Z',
    updated_at: '2026-01-29T15:00:00Z',
  },
]

/**
 * Build a responsive calendar grid with day headers and time slots.
 */
export default function CalendarGrid() {
  /**
   * Filter appointments by date and slot.
   */
  const getAppointmentsForCell = (date: string, slot: TimeSlot) =>
    dummyAppointments.filter(
      (appointment) => appointment.date === date && appointment.slot === slot,
    )

  return (
    <section className="calendar-grid" aria-label="Appointment calendar grid">
      <div className="calendar-grid__cell calendar-grid__header">Slot</div>
      {calendarDays.map((day) => (
        <div
          key={day.date}
          className="calendar-grid__cell calendar-grid__header"
        >
          {day.label}
        </div>
      ))}

      {slotLabels.map((slot) => (
        <Fragment key={slot.slot}>
          <div
            key={`${slot.slot}-label`}
            className="calendar-grid__cell calendar-grid__row-label"
          >
            {slot.label}
          </div>
          {calendarDays.map((day) => (
            <CalendarCell
              key={`${day.date}-${slot.slot}`}
              appointments={getAppointmentsForCell(day.date, slot.slot)}
              slot={slot.slot}
              date={day.date}
            />
          ))}
        </Fragment>
      ))}
    </section>
  )
}
