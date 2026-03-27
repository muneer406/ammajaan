function SearchBar({ value, onChange }) {
  return (
    <div className="control-block">
      <label htmlFor="product-search" className="control-label">
        Search
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products..."
        className="neo-input"
      />
    </div>
  );
}

export default SearchBar;
