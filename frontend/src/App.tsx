import './App.css'
import DispatchDashboard from './components/DispatchDashboard'

/**
 * Root application shell for the dispatch dashboard.
 */
function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Dispatch Dashboard</h1>
        <p className="app__subtitle">
          Assign cleaners, monitor utilization, and balance district load.
        </p>
      </header>
      <DispatchDashboard />
    </div>
  )
}

export default App
