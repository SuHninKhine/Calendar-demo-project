import { useEffect, useState } from 'react'

type SidebarProps = {
  onFilterChange: (prefix: string) => void
  currentFilter: string
  filteredCount: number
  totalCount: number
}

/**
 * Sidebar for filtering appointments by postal prefix.
 */
export default function Sidebar({
  onFilterChange,
  currentFilter,
  filteredCount,
  totalCount,
}: SidebarProps) {
  const [inputValue, setInputValue] = useState(currentFilter)
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Debounce filter changes to reduce rapid updates.
   */
  useEffect(() => {
    const handle = window.setTimeout(() => {
      onFilterChange(inputValue.trim())
    }, 300)
    return () => window.clearTimeout(handle)
  }, [inputValue, onFilterChange])

  /**
   * Keep input synced with external filter updates.
   */
  useEffect(() => {
    setInputValue(currentFilter)
  }, [currentFilter])

  /**
   * Clear the active filter and input state.
   */
  const handleClear = () => {
    setInputValue('')
    onFilterChange('')
  }

  return (
    <>
      <button
        className="sidebar__toggle"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Filters
      </button>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Filter by Postal Prefix</h2>
          <button
            className="sidebar__close"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
        <label className="sidebar__label" htmlFor="postal-prefix">
          Postal prefix (first 2 digits)
        </label>
        <input
          id="postal-prefix"
          className="sidebar__input"
          type="text"
          inputMode="numeric"
          maxLength={2}
          placeholder="e.g. 09"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <p className="sidebar__count">
          Showing {filteredCount} of {totalCount}
        </p>
        <button className="sidebar__clear" type="button" onClick={handleClear}>
          Clear filter
        </button>
      </aside>
    </>
  )
}
