import { usePreferencesStore } from '../stores/usePreferencesStore'

type TransactionFiltersProps = {
  searchTerm: string
  categories: string[]
  onSearchChange: (value: string) => void
}

export function TransactionFilters({
  searchTerm,
  categories,
  onSearchChange,
}: TransactionFiltersProps) {
  const category = usePreferencesStore((state) => state.category)
  const setCategory = usePreferencesStore((state) => state.setCategory)

  return (
    <div className="filters">
      <label className="field">
        <span className="filter-label">Search transactions</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search merchant or category"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="field">
        <span className="filter-label">Category</span>
        <select
          className="category-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="All">All categories</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
