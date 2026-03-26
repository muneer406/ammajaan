import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { useProducts } from "../../hooks/useProducts";

function ProductsPage() {
  const { products, isLoading, error, refetch } = useProducts();

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
        <p>
          Browse our full neo-brutalist catalog and add items directly to cart.
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="neo-panel">
          <p>No products found.</p>
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
