import { useMemo, useState } from 'react'
import { WORKERS } from '../data/workers'
import { useAppointments } from '../hooks/useAppointments'
import { formatWeekRange, getWeekDatesFor } from '../utils/calendarHelpers'
import AppointmentDetailsDrawer from './AppointmentDetailsDrawer'
import CleanerDetailsDrawer from './CleanerDetailsDrawer'
import CleanerUtilizationBoard from './CleanerUtilizationBoard'
import DistrictLoadPanel from './DistrictLoadPanel'
import UnassignedQueue from './UnassignedQueue'

/**
 * Dispatch dashboard layout with district load, unassigned queue, and utilization.
 */
export default function DispatchDashboard() {
  const {
    appointments,
    loading,
    error,
    assignAppointment,
    updateAppointment,
  } = useAppointments()
  const [selectedPostalPrefix, setSelectedPostalPrefix] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)
  const [activeCleanerId, setActiveCleanerId] = useState<string | null>(null)
  const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(
    null,
  )
  const weekDates = useMemo(() => {
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + weekOffset * 7)
    return getWeekDatesFor(baseDate)
  }, [weekOffset])
  const weekLabel = useMemo(() => formatWeekRange(weekDates), [weekDates])

  const filteredAppointments = useMemo(() => {
    if (!selectedPostalPrefix) {
      return appointments
    }
    return appointments.filter((appointment) =>
      appointment.postal_code.startsWith(selectedPostalPrefix),
    )
  }, [appointments, selectedPostalPrefix])

  const assignedAppointments = useMemo(
    () =>
      filteredAppointments.filter((appointment) =>
        appointment.worker_name?.trim(),
      ),
    [filteredAppointments],
  )
  const allAssignedAppointments = useMemo(
    () =>
      appointments.filter((appointment) => appointment.worker_name?.trim()),
    [appointments],
  )

  const unassignedAppointments = useMemo(
    () =>
      filteredAppointments.filter(
        (appointment) => !appointment.worker_name?.trim(),
      ),
    [filteredAppointments],
  )

  const activeCleaner = useMemo(
    () => WORKERS.find((worker) => worker.id === activeCleanerId) ?? null,
    [activeCleanerId],
  )
  const activeAppointment = useMemo(
    () =>
      appointments.find((appointment) => appointment.id === activeAppointmentId) ??
      null,
    [appointments, activeAppointmentId],
  )

  return (
    <section className="dispatch-layout">
      <div className="dispatch-top">
        <DistrictLoadPanel
          appointments={appointments}
          selectedPrefix={selectedPostalPrefix}
          onSelectPrefix={setSelectedPostalPrefix}
        />
      </div>
      <div className="dispatch-main">
        <UnassignedQueue
          appointments={unassignedAppointments}
          assignedAppointments={assignedAppointments}
          workers={WORKERS}
          onAssign={assignAppointment}
          onSelectAppointment={(appointment) => {
            setActiveCleanerId(null)
            setActiveAppointmentId(appointment.id)
          }}
          loading={loading}
          error={error}
        />
        <CleanerUtilizationBoard
          workers={WORKERS}
          assignedAppointments={assignedAppointments}
          allAssignedAppointments={allAssignedAppointments}
          weekDates={weekDates}
          weekLabel={weekLabel}
          onPrevWeek={() => setWeekOffset((current) => current - 1)}
          onNextWeek={() => setWeekOffset((current) => current + 1)}
          onResetWeek={() => setWeekOffset(0)}
          onSelectCleaner={(worker) => {
            setActiveAppointmentId(null)
            setActiveCleanerId(worker.id)
          }}
          onSelectAppointment={(appointment) => {
            setActiveCleanerId(null)
            setActiveAppointmentId(appointment.id)
          }}
          loading={loading}
          error={error}
          selectedPrefix={selectedPostalPrefix}
        />
      </div>
      <CleanerDetailsDrawer
        isOpen={Boolean(activeCleanerId)}
        worker={activeCleaner}
        appointments={assignedAppointments}
        weekDates={weekDates}
        selectedPrefix={selectedPostalPrefix}
        onClose={() => setActiveCleanerId(null)}
      />
      <AppointmentDetailsDrawer
        isOpen={Boolean(activeAppointmentId)}
        appointment={activeAppointment}
        workers={WORKERS}
        assignedAppointments={assignedAppointments}
        onAssign={assignAppointment}
        onUpdate={updateAppointment}
        onClose={() => setActiveAppointmentId(null)}
      />
    </section>
  )
}
