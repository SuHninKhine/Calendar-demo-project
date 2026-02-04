import type { Appointment, TimeSlot } from '../types/appointment'
import type { Worker } from '../data/workers'

export type WorkerOption = {
  name: string
  disabled: boolean
  label: string
}

/**
 * Rule A: A worker is busy if they already have any assigned appointment
 * with the same date and slot.
 */
export const getBusyWorkerNames = (
  appointments: Appointment[],
  date: string,
  slot: TimeSlot,
): Set<string> => {
  const busyNames = appointments
    .filter((appointment) => (appointment.worker_name ?? '').trim())
    .filter((appointment) => appointment.date === date && appointment.slot === slot)
    .map((appointment) => (appointment.worker_name ?? '').trim())
  return new Set(busyNames)
}

/**
 * Build dropdown options showing all workers, marking busy ones as disabled.
 */
export const buildWorkerOptions = (
  workers: Worker[],
  busySet: Set<string>,
): WorkerOption[] =>
  workers.map((worker) => {
    const isBusy = busySet.has(worker.name)
    return {
      name: worker.name,
      disabled: isBusy,
      label: isBusy ? `${worker.name} (Busy)` : worker.name,
    }
  })
