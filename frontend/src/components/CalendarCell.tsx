import type { Appointment, TimeSlot } from '../types/appointment'

type CalendarCellProps = {
  appointments: Appointment[]
  slot: TimeSlot
  date: string
}

/**
 * Renders a single calendar cell for a date/slot combination.
 */
export default function CalendarCell({
  appointments,
  slot,
  date,
}: CalendarCellProps) {
  /**
   * Placeholder click handler for future interactions.
   */
  const handleClick = () => {
    void slot
    void date
  }

  /**
   * Resolve the slot color class for visual styling.
   */
  const getSlotClass = (value: TimeSlot) => {
    if (value === 'MORNING') {
      return 'slot-morning'
    }
    if (value === 'AFTERNOON') {
      return 'slot-afternoon'
    }
    return 'slot-evening'
  }

  const appointmentCount = appointments.length
  const label = `${appointmentCount} appointment${
    appointmentCount === 1 ? '' : 's'
  }`

  return (
    <div
      className={`calendar-grid__cell ${getSlotClass(slot)}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick()
        }
      }}
    >
      {appointmentCount === 0 ? (
        <p className="calendar-grid__availability">Available</p>
      ) : (
        <p className="calendar-grid__count">{label}</p>
      )}
    </div>
  )
}
