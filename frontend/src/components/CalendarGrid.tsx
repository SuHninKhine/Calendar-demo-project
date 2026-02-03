import { Fragment, useMemo } from 'react'
import type { Appointment, TimeSlot } from '../types/appointment'
import {
  formatDate,
  getAppointmentsForSlot,
  getCurrentWeekDates,
} from '../utils/calendarHelpers'
import CalendarCell from './CalendarCell'

type CalendarGridProps = {
  appointments: Appointment[]
  filteredAppointments: Appointment[]
  filterPrefix: string
}

const slotLabels: { slot: TimeSlot; label: string }[] = [
  { slot: 'MORNING', label: 'Morning' },
  { slot: 'AFTERNOON', label: 'Afternoon' },
  { slot: 'EVENING', label: 'Evening' },
]

/**
 * Build a responsive calendar grid with day headers and time slots.
 */
export default function CalendarGrid({
  appointments,
  filteredAppointments,
  filterPrefix,
}: CalendarGridProps) {
  const weekDates = useMemo(() => getCurrentWeekDates(), [])
  const hasFilter = filterPrefix.length > 0

  /**
   * Derive appointments for a specific date and slot.
   */
  const getAppointmentsForCell = (date: Date, slot: TimeSlot) =>
    getAppointmentsForSlot(appointments, date, slot)

  /**
   * Derive filtered appointments for a specific date and slot.
   */
  const getFilteredAppointmentsForCell = (date: Date, slot: TimeSlot) =>
    getAppointmentsForSlot(filteredAppointments, date, slot)

  return (
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
              filteredAppointments={getFilteredAppointmentsForCell(
                day,
                slot.slot,
              )}
              slot={slot.slot}
              date={day.toISOString()}
              hasFilter={hasFilter}
            />
          ))}
        </Fragment>
      ))}
    </section>
  )
}
