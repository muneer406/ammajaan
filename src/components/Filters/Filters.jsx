const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-5000", label: "₹0 - ₹5,000" },
  { value: "5000-20000", label: "₹5,000 - ₹20,000" },
  { value: "20000-50000", label: "₹20,000 - ₹50,000" },
  { value: "50000+", label: "₹50,000+" },
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
