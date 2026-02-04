import type { Appointment, TimeSlot } from '../types/appointment'
import type { Worker } from '../data/workers'
import { toDateKey } from '../utils/calendarHelpers'

type CleanerDetailsDrawerProps = {
  isOpen: boolean
  worker: Worker | null
  appointments: Appointment[]
  weekDates: Date[]
  selectedPrefix: string
  onClose: () => void
}

const SLOT_ORDER: Record<TimeSlot, number> = {
  MORNING: 0,
  AFTERNOON: 1,
  EVENING: 2,
}

/**
 * Drawer showing details for a selected cleaner.
 */
export default function CleanerDetailsDrawer({
  isOpen,
  worker,
  appointments,
  weekDates,
  selectedPrefix,
  onClose,
}: CleanerDetailsDrawerProps) {
  if (!worker) {
    return null
  }

  const todayKey = toDateKey(new Date())

  const workerAppointments = appointments.filter(
    (appointment) =>
      appointment.worker_name?.trim() === worker.name &&
      (!selectedPrefix || appointment.postal_code.startsWith(selectedPrefix)),
  )

  const weekKeys = weekDates.map(toDateKey)
  const thisWeekAppointments = workerAppointments
    .filter((appointment) => weekKeys.includes(appointment.date))
    .sort((a, b) => {
      if (a.date === b.date) {
        return SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]
      }
      return a.date.localeCompare(b.date)
    })

  const upcomingAppointments = workerAppointments
    .filter((appointment) => appointment.date >= todayKey)
    .sort((a, b) => {
      if (a.date === b.date) {
        return SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]
      }
      return a.date.localeCompare(b.date)
    })

  return (
    <div className={`drawer ${isOpen ? 'drawer--open' : ''}`}>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside className="drawer__panel" aria-label="Cleaner details">
        <header className="drawer__header">
          <div>
            <p className="drawer__eyebrow">Cleaner</p>
            <h3 className="drawer__title">{worker.name}</h3>
            {selectedPrefix && (
              <span className="drawer__filter">
                Filtered: {selectedPrefix}
              </span>
            )}
          </div>
          <button className="drawer__close" type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <section className="drawer__section">
          <h4 className="drawer__section-title">This week</h4>
          {thisWeekAppointments.length ? (
            <ul className="drawer__list">
              {thisWeekAppointments.map((appointment) => (
                <li key={appointment.id} className="drawer__list-item">
                  <span>
                    {appointment.date} · {appointment.slot.toLowerCase()}
                  </span>
                  <span>{appointment.client_name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="drawer__empty">No appointments this week.</p>
          )}
        </section>
        <section className="drawer__section">
          <h4 className="drawer__section-title">Upcoming</h4>
          {upcomingAppointments.length ? (
            <ul className="drawer__list">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="drawer__list-item">
                  <span>
                    {appointment.date} · {appointment.slot.toLowerCase()}
                  </span>
                  <span>
                    {appointment.client_name} · {appointment.district}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="drawer__empty">No upcoming appointments.</p>
          )}
        </section>
      </aside>
    </div>
  )
}
