import { useEffect, useMemo, useState } from 'react'
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
  onSelectAppointment: (appointment: Appointment) => void
  loading: boolean
  error: string | null
  selectedPrefix: string
}

type SlotStatus = {
  slot: TimeSlot
  label: string
}

type SlotRange = {
  slot: TimeSlot
  label: string
}

const SLOT_STATUSES: SlotStatus[] = [
  { slot: 'MORNING', label: 'M' },
  { slot: 'AFTERNOON', label: 'A' },
  { slot: 'EVENING', label: 'E' },
]

const SLOT_RANGES: SlotRange[] = [
  { slot: 'MORNING', label: '9:00-12:00' },
  { slot: 'AFTERNOON', label: '13:00-16:00' },
  { slot: 'EVENING', label: '18:00-21:00' },
]

const getSlotRangeLabel = (slot: TimeSlot) =>
  SLOT_RANGES.find((entry) => entry.slot === slot)?.label ?? slot

const getSlotAppointment = (
  appointments: Appointment[],
  workerName: string,
  date: string,
  slot: TimeSlot,
) =>
  appointments.find(
    (appointment) =>
      appointment.worker_name?.trim() === workerName &&
      appointment.date === date &&
      appointment.slot === slot,
  )

const formatDistrictLabel = (district: string | undefined | null) => {
  const raw = district?.trim() || 'Unknown'
  const base = raw.split('/')[0]?.trim() || raw
  return base.length > 12 ? `${base.slice(0, 12)}...` : base
}

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
  onSelectAppointment,
  loading,
  error,
  selectedPrefix,
}: CleanerUtilizationBoardProps) {
  const weekKeys = weekDates.map(toDateKey)
  const todayKey = toDateKey(new Date())
  const [isCompact, setIsCompact] = useState(false)
  const [activeDayKey, setActiveDayKey] = useState('')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)')
    const updateCompact = () => setIsCompact(mediaQuery.matches)
    updateCompact()
    mediaQuery.addEventListener('change', updateCompact)
    return () => mediaQuery.removeEventListener('change', updateCompact)
  }, [])

  useEffect(() => {
    const initialKey = weekKeys.includes(todayKey) ? todayKey : weekKeys[0]
    setActiveDayKey((current) => current || initialKey)
  }, [todayKey, weekKeys])

  useEffect(() => {
    if (!activeDayKey && weekKeys.length > 0) {
      setActiveDayKey(weekKeys[0])
    }
  }, [activeDayKey, weekKeys])

  const activeDayIndex = useMemo(() => {
    const index = weekKeys.indexOf(activeDayKey)
    return index >= 0 ? index : 0
  }, [activeDayKey, weekKeys])

  const visibleDates = useMemo(
    () => (isCompact ? [weekDates[activeDayIndex]] : weekDates),
    [activeDayIndex, isCompact, weekDates],
  )
  const visibleKeys = useMemo(
    () => (isCompact ? [weekKeys[activeDayIndex]] : weekKeys),
    [activeDayIndex, isCompact, weekKeys],
  )

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
            {'<- Prev'}
          </button>
          <button className="week-nav__button" type="button" onClick={onResetWeek}>
            This Week
          </button>
          <button className="week-nav__button" type="button" onClick={onNextWeek}>
            {'Next ->'}
          </button>
          {selectedPrefix && (
            <span className="board__filter">
              Filtered: {selectedPrefix}
            </span>
          )}
        </div>
      </header>
      {isCompact && (
        <div className="board__day-picker">
          {weekDates.map((date) => (
            <button
              key={toDateKey(date)}
              type="button"
              className={`board__day-button${
                toDateKey(date) === activeDayKey
                  ? ' board__day-button--active'
                  : ''
              }`}
              onClick={() => setActiveDayKey(toDateKey(date))}
            >
              {date.toLocaleDateString('en-SG', {
                weekday: 'short',
                day: 'numeric',
              })}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="board__status">Loading appointments...</p>}
      {error && <p className="board__status">{error}</p>}
      <div className="board__grid board__grid--scroll">
        <div
          className={`board__row board__row--header${
            isCompact ? ' board__row--compact' : ''
          }`}
        >
          <div className="board__cell board__cell--header">Cleaner</div>
          {visibleDates.map((date) => (
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
            <div
              key={worker.id}
              className={`board__row${isCompact ? ' board__row--compact' : ''}`}
            >
              <div className="board__cell board__cell--label">
                <button
                  type="button"
                  className="board__worker"
                  onClick={() => onSelectCleaner(worker)}
                >
                  <span className="board__worker-name">{worker.name}</span>
                  <span className="board__worker-meta">
                    This week: {weeklyCount}
                  </span>
                  <span className="board__worker-meta">
                    Incoming: {incomingCount}
                  </span>
                </button>
              </div>
              {visibleKeys.map((dateKey) => (
                <div key={`${worker.id}-${dateKey}`} className="board__cell">
                  <div className="board__slots">
                    {SLOT_STATUSES.map((slot) => {
                      const isBusy = getSlotStatus(worker.name, dateKey, slot.slot)
                      const slotAppointment = isBusy
                        ? getSlotAppointment(
                            assignedAppointments,
                            worker.name,
                            dateKey,
                            slot.slot,
                          )
                        : undefined
                      const districtLabel = formatDistrictLabel(
                        slotAppointment?.district,
                      )
                      return isBusy && slotAppointment ? (
                        <button
                          key={`${worker.id}-${dateKey}-${slot.slot}`}
                          type="button"
                          className={`board__slot board__slot--busy board__slot-button${
                            slotAppointment.status === 'done'
                              ? ' board__slot--done'
                              : ''
                          }`}
                          title={`${slot.slot.toLowerCase()} slot`}
                          onClick={() => onSelectAppointment(slotAppointment)}
                        >
                          <span className="board__slot-time">
                            {getSlotRangeLabel(slot.slot)}
                          </span>
                          <span
                            className="board__slot-district"
                            title={slotAppointment.district || 'Unknown'}
                          >
                            {districtLabel}
                          </span>
                        </button>
                      ) : (
                        <span
                          key={`${worker.id}-${dateKey}-${slot.slot}`}
                          className="board__slot"
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
