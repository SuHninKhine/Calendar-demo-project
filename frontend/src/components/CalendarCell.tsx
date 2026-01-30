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
  const clientNames = appointments.map((appointment) => appointment.client_name)
  const tooltip = appointmentCount
    ? `Appointments on ${date.split('T')[0]}:\n${clientNames.join('\n')}`
    : `Available on ${date.split('T')[0]}`
  const inlineNames =
    appointmentCount > 0 && appointmentCount <= 2
      ? clientNames.filter((name, index) => clientNames.indexOf(name) === index)
      : []
  const showCount = appointmentCount > 2

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
      title={tooltip}
    >
      {appointmentCount === 0 ? (
        <p className="calendar-grid__availability">Available</p>
      ) : (
        <>
          {showCount && <p className="calendar-grid__count">{label}</p>}
          {inlineNames.map((name, index) => (
            <p key={name} className="calendar-grid__count">
              {appointmentCount === 2 ? `${index + 1}. ${name}` : name}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
