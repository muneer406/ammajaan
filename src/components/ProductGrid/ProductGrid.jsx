import ProductCard from "../ProductCard/ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="page-grid" aria-live="polite">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
