import type { Appointment, TimeSlot } from '../types/appointment'
import type { Worker } from '../data/workers'
import { toDateKey } from '../utils/calendarHelpers'

type CleanerUtilizationBoardProps = {
  workers: Worker[]
  assignedAppointments: Appointment[]
  allAssignedAppointments: Appointment[]
  weekDates: Date[]
  weekLabel: string
  onPrevWeek: () => void
  onNextWeek: () => void
  onResetWeek: () => void
  onSelectCleaner: (worker: Worker) => void
  loading: boolean
  error: string | null
  selectedPrefix: string
}

type SlotStatus = {
  slot: TimeSlot
  label: string
}

const SLOT_STATUSES: SlotStatus[] = [
  { slot: 'MORNING', label: 'M' },
  { slot: 'AFTERNOON', label: 'A' },
  { slot: 'EVENING', label: 'E' },
]

/**
 * Utilization board showing booked slots per cleaner.
 */
export default function CleanerUtilizationBoard({
  workers,
  assignedAppointments,
  allAssignedAppointments,
  weekDates,
  weekLabel,
  onPrevWeek,
  onNextWeek,
  onResetWeek,
  onSelectCleaner,
  loading,
  error,
  selectedPrefix,
}: CleanerUtilizationBoardProps) {
  const weekKeys = weekDates.map(toDateKey)
  const todayKey = toDateKey(new Date())

  const getIncomingCount = (workerName: string) =>
    allAssignedAppointments.filter(
      (appointment) =>
        appointment.worker_name?.trim() === workerName &&
        appointment.date >= todayKey,
    ).length

  const getWeeklyCount = (workerName: string) =>
    assignedAppointments.filter(
      (appointment) =>
        appointment.worker_name?.trim() === workerName &&
        weekKeys.includes(appointment.date),
    ).length

  const getSlotStatus = (workerName: string, date: string, slot: TimeSlot) =>
    assignedAppointments.some(
      (appointment) =>
        appointment.worker_name?.trim() === workerName &&
        appointment.date === date &&
        appointment.slot === slot,
    )

  return (
    <section className="board">
      <header className="board__header">
        <div>
          <h2 className="board__title">Cleaner Utilization</h2>
          <p className="board__subtitle">
            Busy/free slots for the current week.
          </p>
          <p className="board__week-label">{weekLabel}</p>
        </div>
        <div className="board__actions">
          <button className="week-nav__button" type="button" onClick={onPrevWeek}>
            ← Prev
          </button>
          <button className="week-nav__button" type="button" onClick={onResetWeek}>
            This Week
          </button>
          <button className="week-nav__button" type="button" onClick={onNextWeek}>
            Next →
          </button>
          {selectedPrefix && (
            <span className="board__filter">
              Filtered: {selectedPrefix}
            </span>
          )}
        </div>
      </header>
      {loading && <p className="board__status">Loading appointments...</p>}
      {error && <p className="board__status">{error}</p>}
      <div className="board__grid board__grid--scroll">
        <div className="board__row board__row--header">
          <div className="board__cell board__cell--header">Cleaner</div>
          {weekDates.map((date) => (
            <div key={toDateKey(date)} className="board__cell board__cell--header">
              {date.toLocaleDateString('en-SG', {
                weekday: 'short',
                day: 'numeric',
              })}
            </div>
          ))}
        </div>
        {workers.map((worker) => {
          const incomingCount = getIncomingCount(worker.name)
          const weeklyCount = getWeeklyCount(worker.name)
          return (
            <div key={worker.id} className="board__row">
              <div className="board__cell board__cell--label">
                <button
                  type="button"
                  className="board__worker"
                  onClick={() => onSelectCleaner(worker)}
                >
                  <span className="board__worker-name">{worker.name}</span>
                  <span className="board__worker-meta">
                    This week: {weeklyCount} · Incoming: {incomingCount}
                  </span>
                </button>
              </div>
              {weekKeys.map((dateKey) => (
                <div key={`${worker.id}-${dateKey}`} className="board__cell">
                  <div className="board__slots">
                    {SLOT_STATUSES.map((slot) => {
                      const isBusy = getSlotStatus(worker.name, dateKey, slot.slot)
                      return (
                        <span
                          key={`${worker.id}-${dateKey}-${slot.slot}`}
                          className={`board__slot${
                            isBusy ? ' board__slot--busy' : ''
                          }`}
                          title={`${slot.slot.toLowerCase()} slot`}
                        >
                          {slot.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
