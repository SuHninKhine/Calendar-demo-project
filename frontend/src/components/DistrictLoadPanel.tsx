import type { Appointment } from '../types/appointment'

type DistrictLoadPanelProps = {
  appointments: Appointment[]
  selectedPrefix: string
  onSelectPrefix: (prefix: string) => void
}

type DistrictRow = {
  prefix: string
  district: string
  total: number
  unassigned: number
}

/**
 * District load summary with selectable postal prefix filters.
 */
export default function DistrictLoadPanel({
  appointments,
  selectedPrefix,
  onSelectPrefix,
}: DistrictLoadPanelProps) {
  const rows = appointments.reduce<Record<string, DistrictRow>>(
    (acc, appointment) => {
      const prefix = appointment.postal_code.slice(0, 2)
      if (!acc[prefix]) {
        acc[prefix] = {
          prefix,
          district: appointment.district,
          total: 0,
          unassigned: 0,
        }
      }
      acc[prefix].total += 1
      if (!appointment.worker_name?.trim()) {
        acc[prefix].unassigned += 1
      }
      return acc
    },
    {},
  )

  const sortedRows = Object.values(rows).sort((a, b) => {
    if (b.unassigned !== a.unassigned) {
      return b.unassigned - a.unassigned
    }
    return b.total - a.total
  })
  const selectedRow = sortedRows.find((row) => row.prefix === selectedPrefix)
  const allUnassigned = appointments.filter(
    (appointment) => !appointment.worker_name?.trim(),
  ).length

  return (
    <section className="panel">
      <header className="panel__header">
        <h2 className="panel__title">District Load</h2>
        <p className="panel__subtitle">Select a district to filter workload.</p>
      </header>
      <label className="panel__label" htmlFor="district-filter">
        District filter
      </label>
      <select
        id="district-filter"
        className="panel__select"
        value={selectedPrefix}
        onChange={(event) => onSelectPrefix(event.target.value)}
      >
        <option value="">
          All districts ({allUnassigned} unassigned)
        </option>
        {sortedRows.map((row) => (
          <option key={row.prefix} value={row.prefix}>
            {row.prefix} — {row.district} ({row.unassigned} unassigned)
          </option>
        ))}
      </select>
      <div className="panel__summary">
        <span className="panel__summary-label">Unassigned</span>
        <span className="panel__summary-value">
          {selectedRow ? selectedRow.unassigned : allUnassigned}
        </span>
      </div>
      {!sortedRows.length && (
        <p className="panel__empty">No appointments to summarize.</p>
      )}
    </section>
  )
}
