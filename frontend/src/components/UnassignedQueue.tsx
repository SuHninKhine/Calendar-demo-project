import type { Appointment, TimeSlot } from '../types/appointment'
import type { Worker } from '../data/workers'
import { buildWorkerOptions, getBusyWorkerNames } from '../utils/availability'

type UnassignedQueueProps = {
  appointments: Appointment[]
  assignedAppointments: Appointment[]
  workers: Worker[]
  onAssign: (appointmentId: number, workerName: string) => Promise<void>
  loading: boolean
  error: string | null
}

type AppointmentGroup = {
  date: string
  slot: TimeSlot
  items: Appointment[]
}

const SLOT_ORDER: Record<TimeSlot, number> = {
  MORNING: 0,
  AFTERNOON: 1,
  EVENING: 2,
}

/**
 * Render unassigned appointments grouped by date and slot.
 */
export default function UnassignedQueue({
  appointments,
  assignedAppointments,
  workers,
  onAssign,
  loading,
  error,
}: UnassignedQueueProps) {
  const groups = appointments.reduce<Record<string, AppointmentGroup>>(
    (acc, appointment) => {
      const key = `${appointment.date}-${appointment.slot}`
      if (!acc[key]) {
        acc[key] = {
          date: appointment.date,
          slot: appointment.slot,
          items: [],
        }
      }
      acc[key].items.push(appointment)
      return acc
    },
    {},
  )

  const orderedGroups = Object.values(groups).sort((a, b) => {
    if (a.date === b.date) {
      return SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]
    }
    return a.date.localeCompare(b.date)
  })

  const formatGroupLabel = (date: string, slot: TimeSlot) => {
    const safeDate = new Date(`${date}T00:00:00`)
    const label = safeDate.toLocaleDateString('en-SG', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    const slotLabel = slot.toLowerCase()
    return `${label} • ${slotLabel.charAt(0).toUpperCase()}${slotLabel.slice(1)}`
  }

  const maskPostal = (postalCode: string) =>
    `${postalCode.slice(0, 2)}xxxx`

  return (
    <section className="panel panel--queue">
      <header className="panel__header">
        <h2 className="panel__title">Unassigned Queue</h2>
        <p className="panel__subtitle">
          Work waiting to be dispatched ({appointments.length})
        </p>
      </header>
      {loading && <p className="panel__status">Loading appointments...</p>}
      {error && <p className="panel__status">{error}</p>}
      {!orderedGroups.length && !loading && (
        <p className="panel__empty">No unassigned appointments.</p>
      )}
      <div className="queue queue--scroll">
        {orderedGroups.map((group) => {
          const busySet = getBusyWorkerNames(
            assignedAppointments,
            group.date,
            group.slot,
          )
          const options = buildWorkerOptions(workers, busySet)
          const hasAvailable = options.some((option) => !option.disabled)

          return (
            <div key={`${group.date}-${group.slot}`} className="queue__group">
              <div className="queue__group-header">
                <h3 className="queue__group-title">
                  {formatGroupLabel(group.date, group.slot)}
                </h3>
                <span className="queue__group-count">
                  {group.items.length} appointment
                  {group.items.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="queue__cards">
                {group.items.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="queue__card"
                  >
                    <div>
                      <p className="queue__client">{appointment.client_name}</p>
                      <p className="queue__meta">
                        {maskPostal(appointment.postal_code)} •{' '}
                        {appointment.district}
                      </p>
                    </div>
                    <div className="queue__action">
                      <label className="queue__label" htmlFor={`assign-${appointment.id}`}>
                        Assign
                      </label>
                      <select
                        id={`assign-${appointment.id}`}
                        className="queue__select"
                        disabled={!hasAvailable}
                        defaultValue=""
                        onChange={(event) => {
                          const workerName = event.target.value
                          if (workerName) {
                            void onAssign(appointment.id, workerName)
                          }
                        }}
                      >
                        {!hasAvailable ? (
                          <option value="" disabled>
                            No cleaners available
                          </option>
                        ) : (
                          <option value="" disabled>
                            Select cleaner
                          </option>
                        )}
                        {options.map((option) => (
                          <option
                            key={`${appointment.id}-${option.name}`}
                            value={option.name}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
