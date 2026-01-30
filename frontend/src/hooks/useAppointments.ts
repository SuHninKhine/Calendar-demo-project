import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Appointment } from '../types/appointment'

type AppointmentResponse =
  | Appointment[]
  | {
      results?: Appointment[]
    }

type UseAppointmentsResult = {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
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
      setAppointments(extractAppointments(response.data))
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

  return { appointments, loading, error, refetch: fetchAppointments }
}
