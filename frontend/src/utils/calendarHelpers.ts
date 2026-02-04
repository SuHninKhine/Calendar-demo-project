import type { Appointment, TimeSlot } from '../types/appointment'

/**
 * Convert a Date into a YYYY-MM-DD string using local time.
 */
export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get week dates (Monday through Sunday) for a reference date.
 */
export const getWeekDatesFor = (referenceDate: Date): Date[] => {
  const today = new Date(referenceDate)
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
 * Get the current week dates (Monday through Sunday).
 */
export const getCurrentWeekDates = (): Date[] => getWeekDatesFor(new Date())

/**
 * Filter appointments by date and slot.
 */
export const getAppointmentsForSlot = (
  appointments: Appointment[],
  date: Date,
  slot: TimeSlot,
): Appointment[] => {
  const dateStr = toDateKey(date)
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

/**
 * Format a week range label (e.g., "Feb 3 - Feb 9").
 */
export const formatWeekRange = (weekDates: Date[]): string => {
  if (!weekDates.length) {
    return ''
  }
  const start = weekDates[0].toLocaleDateString('en-SG', {
    month: 'short',
    day: 'numeric',
  })
  const end = weekDates[weekDates.length - 1].toLocaleDateString('en-SG', {
    month: 'short',
    day: 'numeric',
  })
  return `${start} - ${end}`
}
