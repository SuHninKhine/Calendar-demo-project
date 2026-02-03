import type { Appointment, TimeSlot } from '../types/appointment'

type CalendarCellProps = {
  appointments: Appointment[]
  filteredAppointments: Appointment[]
  slot: TimeSlot
  date: string
  hasFilter: boolean
}

/**
 * Renders a single calendar cell for a date/slot combination.
 */
export default function CalendarCell({
  appointments,
  filteredAppointments,
  slot,
  date,
  hasFilter,
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

  const totalAppointments = appointments.length
  const visibleAppointments = hasFilter ? filteredAppointments : appointments
  const visibleCount = visibleAppointments.length
  const label = `${visibleCount} appointment${visibleCount === 1 ? '' : 's'}`
  const clientNames = visibleAppointments.map(
    (appointment) => appointment.client_name,
  )
  const tooltip = visibleCount
    ? `Appointments on ${date.split('T')[0]}:\n${clientNames.join('\n')}`
    : `Available on ${date.split('T')[0]}`
  const inlineNames =
    visibleCount > 0 && visibleCount <= 2
      ? clientNames.filter((name, index) => clientNames.indexOf(name) === index)
      : []
  const showCount = visibleCount > 2
  const isHighlighted = hasFilter && visibleCount > 0
  const isFaded = hasFilter && visibleCount === 0 && totalAppointments > 0

  return (
    <div
      className={`calendar-grid__cell ${getSlotClass(slot)}${
        isHighlighted ? ' calendar-grid__cell--highlight' : ''
      }${isFaded ? ' calendar-grid__cell--faded' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick()
        }
      }}
      title={tooltip}
    >
      {visibleCount === 0 ? (
        <p className="calendar-grid__availability">Available</p>
      ) : (
        <>
          {showCount && <p className="calendar-grid__count">{label}</p>}
          {inlineNames.map((name, index) => (
            <p key={name} className="calendar-grid__count">
              {visibleCount === 2 ? `${index + 1}. ${name}` : name}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
