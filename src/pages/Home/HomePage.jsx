import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { useProducts } from "../../hooks/useProducts";

function HomePage() {
  const { products, isLoading, error, refetch } = useProducts();

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
      .slice(0, 6);
  }, [products]);

  return (
    <section className="page">
      <div className="neo-hero">
        <h1>Shop Loud. Shop Sharp.</h1>
        <p>
          Neo-brutalist e-commerce experience with bold visuals, fast filters,
          and frictionless cart flow.
        </p>
        <div>
          <Link to="/products" className="nav-link">
            Explore Products
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="neo-panel">
          <h2>Featured</h2>
          <p>Loading featured picks...</p>
        </div>
      )}

      {error && (
        <div className="neo-panel">
          <h2>Featured</h2>
          <p>{error}</p>
          <button type="button" className="nav-link" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="neo-panel home-featured-head">
            <h2>Featured products</h2>
            <p>Top-rated picks from the catalog.</p>
            <Link to="/products" className="nav-link">
              View all products
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </>
      )}
    </section>
  );
}

export default HomePage;
