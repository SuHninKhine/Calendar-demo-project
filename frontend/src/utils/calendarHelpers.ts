import type { Appointment, TimeSlot } from '../types/appointment'

/**
 * Get the current week dates (Monday through Sunday).
 */
export const getCurrentWeekDates = (): Date[] => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

/**
 * Filter appointments by date and slot.
 */
export const getAppointmentsForSlot = (
  appointments: Appointment[],
  date: Date,
  slot: TimeSlot,
): Appointment[] => {
  const dateStr = date.toISOString().split('T')[0]
  return appointments.filter(
    (appointment) => appointment.date === dateStr && appointment.slot === slot,
  )
}

/**
 * Format a date for display in the calendar header.
 */
export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-SG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
