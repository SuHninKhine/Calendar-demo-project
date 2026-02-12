import { useEffect, useMemo, useState } from 'react'
import type { Appointment, TimeSlot } from '../types/appointment'
import type { Worker } from '../data/workers'
import { buildWorkerOptions } from '../utils/availability'

type AppointmentDetailsDrawerProps = {
  isOpen: boolean
  appointment: Appointment | null
  workers: Worker[]
  assignedAppointments: Appointment[]
  onAssign: (appointmentId: number, workerName: string) => Promise<void>
  onUpdate: (
    appointmentId: number,
    updates: Partial<Appointment>,
    errorMessage?: string,
  ) => Promise<void>
  onClose: () => void
}

const SLOT_RANGES: Record<TimeSlot, string> = {
  MORNING: '9:00-12:00',
  AFTERNOON: '13:00-16:00',
  EVENING: '18:00-21:00',
}

const STATUS_LABELS: Record<Appointment['status'], string> = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  done: 'Done',
}

const getBusySet = (
  appointments: Appointment[],
  date: string,
  slot: TimeSlot,
  excludeId: number,
) =>
  new Set(
    appointments
      .filter(
        (appointment) =>
          appointment.id !== excludeId &&
          appointment.worker_name?.trim() &&
          appointment.date === date &&
          appointment.slot === slot,
      )
      .map((appointment) => appointment.worker_name!.trim()),
  )

const formatAppointmentLine = (appointment: Appointment) =>
  `${appointment.date} | ${SLOT_RANGES[appointment.slot]}`

const formatAppointmentMeta = (appointment: Appointment) =>
  `${appointment.client_name} | ${appointment.district}`

/**
 * Drawer showing details for a selected appointment.
 */
export default function AppointmentDetailsDrawer({
  isOpen,
  appointment,
  workers,
  assignedAppointments,
  onAssign,
  onUpdate,
  onClose,
}: AppointmentDetailsDrawerProps) {
  const [paymentId, setPaymentId] = useState('')

  useEffect(() => {
    setPaymentId(appointment?.payment_id ?? '')
  }, [appointment])

  const workerOptions = useMemo(() => {
    if (!appointment) {
      return []
    }
    const busySet = getBusySet(
      assignedAppointments,
      appointment.date,
      appointment.slot,
      appointment.id,
    )
    return buildWorkerOptions(workers, busySet)
  }, [appointment, assignedAppointments, workers])

  if (!appointment) {
    return null
  }

  const assignedWorker = appointment.worker_name?.trim() || ''
  const status = appointment.status || 'requested'
  const canConfirmPayment = assignedWorker && paymentId.trim()
  const canMarkDone = status === 'confirmed'

  return (
    <div className={`drawer appointment-drawer ${isOpen ? 'drawer--open' : ''}`}>
      <div className="drawer__backdrop" onClick={onClose} />
      <aside className="drawer__panel" aria-label="Appointment details">
        <header className="drawer__header">
          <div>
            <p className="drawer__eyebrow">Appointment</p>
            <h3 className="drawer__title">{appointment.client_name}</h3>
            <span className={`drawer__badge drawer__badge--${status}`}>
              {STATUS_LABELS[status]}
            </span>
          </div>
          <button className="drawer__close" type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <section className="drawer__section">
          <h4 className="drawer__section-title">Details</h4>
          <div className="drawer__list-item">
            <span>{formatAppointmentLine(appointment)}</span>
            <span>{appointment.district}</span>
            <span>{appointment.address}</span>
          </div>
        </section>
        <section className="drawer__section">
          <h4 className="drawer__section-title">Cleaner</h4>
          <div className="drawer__field">
            <label className="drawer__label" htmlFor="appointment-worker">
              Assign / Reassign
            </label>
            <select
              id="appointment-worker"
              className="drawer__input"
              value={assignedWorker}
              onChange={(event) => {
                const workerName = event.target.value
                if (workerName) {
                  void onAssign(appointment.id, workerName)
                }
              }}
            >
              <option value="" disabled>
                {assignedWorker ? 'Change cleaner' : 'Select cleaner'}
              </option>
              {workerOptions.map((option) => (
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
        </section>
        <section className="drawer__section">
          <h4 className="drawer__section-title">Payment</h4>
          <div className="drawer__field">
            <label className="drawer__label" htmlFor="payment-id">
              Payment ID
            </label>
            <input
              id="payment-id"
              className="drawer__input"
              value={paymentId}
              onChange={(event) => setPaymentId(event.target.value)}
              placeholder="e.g. PAY-1024"
            />
          </div>
          <div className="drawer__actions">
            <button
              className="drawer__button drawer__button--primary"
              type="button"
              disabled={!canConfirmPayment}
              onClick={() => {
                void onUpdate(appointment.id, {
                  payment_id: paymentId.trim(),
                  status: 'confirmed',
                })
              }}
            >
              Add payment ID
            </button>
            <button
              className="drawer__button"
              type="button"
              disabled={!canMarkDone}
              onClick={() => {
                void onUpdate(appointment.id, { status: 'done' })
              }}
            >
              Mark done
            </button>
          </div>
        </section>
      </aside>
    </div>
  )
}
