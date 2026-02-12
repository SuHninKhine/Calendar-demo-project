import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Appointment } from '../types/appointment'

type AppointmentResponse =
  | Appointment[]
  | {
      results?: Appointment[]
      next?: string | null
    }

type UseAppointmentsResult = {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  filterByPostalPrefix: (prefix: string) => Appointment[]
  assignAppointment: (appointmentId: number, workerName: string) => Promise<void>
  updateAppointment: (
    appointmentId: number,
    updates: Partial<Appointment>,
    errorMessage?: string,
  ) => Promise<void>
}

/**
 * Fetch appointments from the API with loading and error states.
 */
export const useAppointments = (): UseAppointmentsResult => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Normalize API responses that may be paginated.
   */
  const extractAppointments = (data: AppointmentResponse): Appointment[] => {
    if (Array.isArray(data)) {
      return data
    }
    return data.results ?? []
  }

  /**
   * Load appointments from the backend API.
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await api.get<AppointmentResponse>('/appointments/')
      if (Array.isArray(response.data)) {
        setAppointments(response.data)
        setError(null)
        return
      }

      const collected: Appointment[] = []
      let nextUrl: string | null | undefined = '/appointments/'

      while (nextUrl) {
        const pageResponse = await api.get<AppointmentResponse>(nextUrl)
        if (Array.isArray(pageResponse.data)) {
          collected.push(...pageResponse.data)
          nextUrl = null
        } else {
          collected.push(...(pageResponse.data.results ?? []))
          nextUrl = pageResponse.data.next
        }
      }

      setAppointments(collected)
      setError(null)
    } catch (err) {
      setError('Failed to fetch appointments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchAppointments()
  }, [])

  /**
   * Filter appointments by the provided postal prefix.
   */
  const filterByPostalPrefix = (prefix: string): Appointment[] => {
    if (!prefix) {
      return appointments
    }
    return appointments.filter((appointment) =>
      appointment.postal_code.startsWith(prefix),
    )
  }

  /**
   * Assign a worker to an appointment and sync with the API.
   */
  const assignAppointment = async (
    appointmentId: number,
    workerName: string,
  ) => {
    const trimmedName = workerName.trim()
    if (!trimmedName) {
      return
    }
    await updateAppointment(
      appointmentId,
      { worker_name: trimmedName, status: 'confirmed' },
      'Failed to assign appointment',
    )
  }

  /**
   * Patch appointment fields and sync with the API.
   */
  const updateAppointment = async (
    appointmentId: number,
    updates: Partial<Appointment>,
    errorMessage = 'Failed to update appointment',
  ) => {
    const previousAppointments = [...appointments]
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, ...updates }
          : appointment,
      ),
    )
    try {
      await api.patch(`/appointments/${appointmentId}/`, updates)
      setError(null)
    } catch (err) {
      setAppointments(previousAppointments)
      setError(errorMessage)
      console.error(err)
    }
  }

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    filterByPostalPrefix,
    assignAppointment,
    updateAppointment,
  }
}
