import { Link } from "react-router-dom";

function HomePage() {
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
    </section>
  );
}

export default HomePage;
