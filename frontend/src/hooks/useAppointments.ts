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
    const previousAppointments = [...appointments]
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, worker_name: trimmedName }
          : appointment,
      ),
    )
    try {
      await api.patch(`/appointments/${appointmentId}/`, {
        worker_name: trimmedName,
      })
      setError(null)
    } catch (err) {
      setAppointments(previousAppointments)
      setError('Failed to assign appointment')
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
  }
}
