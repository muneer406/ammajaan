const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-100", label: "0 - 100" },
  { value: "100-500", label: "100 - 500" },
  { value: "500-1000", label: "500 - 1000" },
  { value: "1000+", label: "1000+" },
];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "rating", label: "Top rating" },
  { value: "newest", label: "Newest" },
];

function Filters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <aside className="filters-panel neo-panel" aria-label="Product filters">
      <div className="control-block">
        <label htmlFor="category-filter" className="control-label">
          Category
        </label>
        <select
          id="category-filter"
          className="neo-select"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="control-block">
        <label htmlFor="price-filter" className="control-label">
          Price range
        </label>
        <select
          id="price-filter"
          className="neo-select"
          value={selectedPriceRange}
          onChange={(event) => onPriceRangeChange(event.target.value)}
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-block">
        <label htmlFor="sort-filter" className="control-label">
          Sort by
        </label>
        <select
          id="sort-filter"
          className="neo-select"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default Filters;
