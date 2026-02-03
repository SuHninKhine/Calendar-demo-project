import './App.css'
import FilteredCalendarGrid from './components/FilteredCalendarGrid'

/**
 * Root application shell for the appointment calendar.
 */
function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Appointment Calendar</h1>
        <p className="app__subtitle">
          Track bookings across morning, afternoon, and evening slots.
        </p>
      </header>
      <FilteredCalendarGrid />
    </div>
  )
}

export default App
