import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <section className="page">
      <div className="neo-panel">
        <h2>Product Details</h2>
        <p>Selected product id: {id}</p>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
