type TransactionFiltersProps = {
  searchTerm: string
  category: string
  categories: string[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function TransactionFilters({
  searchTerm,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: TransactionFiltersProps) {
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
          onChange={(event) => onCategoryChange(event.target.value)}
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
