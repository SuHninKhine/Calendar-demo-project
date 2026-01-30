import { Fragment, useMemo } from 'react'
import type { TimeSlot } from '../types/appointment'
import { useAppointments } from '../hooks/useAppointments'
import {
  formatDate,
  getAppointmentsForSlot,
  getCurrentWeekDates,
} from '../utils/calendarHelpers'
import CalendarCell from './CalendarCell'

const slotLabels: { slot: TimeSlot; label: string }[] = [
  { slot: 'MORNING', label: 'Morning' },
  { slot: 'AFTERNOON', label: 'Afternoon' },
  { slot: 'EVENING', label: 'Evening' },
]

/**
 * Build a responsive calendar grid with day headers and time slots.
 */
export default function CalendarGrid() {
  const { appointments, loading, error } = useAppointments()
  const weekDates = useMemo(() => getCurrentWeekDates(), [])

  /**
   * Derive appointments for a specific date and slot.
   */
  const getAppointmentsForCell = (date: Date, slot: TimeSlot) =>
    getAppointmentsForSlot(appointments, date, slot)

  return (
    <>
      {loading && (
        <p className="calendar-grid__status">Loading appointments...</p>
      )}
      {error && <p className="calendar-grid__status">{error}</p>}
      <section className="calendar-grid" aria-label="Appointment calendar grid">
        <div className="calendar-grid__cell calendar-grid__header">Slot</div>
        {weekDates.map((day) => (
          <div
            key={day.toISOString()}
            className="calendar-grid__cell calendar-grid__header"
          >
            {formatDate(day)}
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
            {weekDates.map((day) => (
              <CalendarCell
                key={`${day.toISOString()}-${slot.slot}`}
                appointments={getAppointmentsForCell(day, slot.slot)}
                slot={slot.slot}
                date={day.toISOString()}
              />
            ))}
          </Fragment>
        ))}
      </section>
    </>
  )
}
