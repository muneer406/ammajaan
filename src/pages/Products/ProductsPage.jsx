import { useMemo, useState } from "react";
import Filters from "../../components/Filters/Filters";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useDebounce } from "../../hooks/useDebounce";
import { useProducts } from "../../hooks/useProducts";

const inRange = (price, range) => {
  if (range === "all") return true;
  if (range === "0-100") return price >= 0 && price <= 100;
  if (range === "100-500") return price > 100 && price <= 500;
  if (range === "500-1000") return price > 500 && price <= 1000;
  if (range === "1000+") return price > 1000;
  return true;
};

function ProductsPage() {
  const { products, categories, isLoading, error, refetch } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredProducts = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        search.length === 0 || product.title.toLowerCase().includes(search);
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = inRange(product.price, selectedPriceRange);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return [...filtered].sort(
        (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
      );
    }
    if (sortBy === "newest") {
      return [...filtered].sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [debouncedSearch, products, selectedCategory, selectedPriceRange, sortBy]);

  if (isLoading) {
    return (
      <section className="page">
        <div className="neo-panel">
          <h2>Products</h2>
          <p>Loading catalog...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="neo-panel">
          <h2>Products</h2>
          <p>{error}</p>
          <button type="button" className="nav-link" onClick={refetch}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="neo-hero">
        <h2>Products</h2>
        <p>Search faster, filter smarter, and sort your way.</p>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="category-tabs" role="tablist" aria-label="Category tabs">
        <button
          type="button"
          role="tab"
          className={
            selectedCategory === "all" ? "tab-chip active" : "tab-chip"
          }
          aria-selected={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            className={
              selectedCategory === category ? "tab-chip active" : "tab-chip"
            }
            aria-selected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="products-layout">
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="neo-panel">
            <p>No products match your current filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsPage;
