import { useCallback, useMemo, useState } from 'react'
import CalendarGrid from './CalendarGrid'
import Sidebar from './Sidebar'
import { useAppointments } from '../hooks/useAppointments'

/**
 * Wraps the calendar grid with postal prefix filtering logic.
 */
export default function FilteredCalendarGrid() {
  const { appointments, loading, error, filterByPostalPrefix } =
    useAppointments()
  const [postalPrefix, setPostalPrefix] = useState('')

  /**
   * Update the current postal prefix filter.
   */
  const handleFilterChange = useCallback((prefix: string) => {
    setPostalPrefix(prefix)
  }, [])

  const filteredAppointments = useMemo(
    () => filterByPostalPrefix(postalPrefix),
    [filterByPostalPrefix, postalPrefix],
  )

  return (
    <div className="calendar-layout">
      <Sidebar
        currentFilter={postalPrefix}
        onFilterChange={handleFilterChange}
        filteredCount={filteredAppointments.length}
        totalCount={appointments.length}
      />
      <div>
        {postalPrefix && (
          <p className="filter-indicator">
            Showing results for postal prefix: {postalPrefix}
          </p>
        )}
        {loading && (
          <p className="calendar-grid__status">Loading appointments...</p>
        )}
        {error && <p className="calendar-grid__status">{error}</p>}
        <CalendarGrid
          appointments={appointments}
          filteredAppointments={filteredAppointments}
          filterPrefix={postalPrefix}
        />
      </div>
    </div>
  )
}
