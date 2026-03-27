import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";

function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  const handleRemove = (item) => {
    toggleWishlist({ id: item.productId, title: item.title });
  };

  return (
    <section className="page">
      <div className="neo-hero">
        <h2>Wishlist</h2>
        <p>Saved items: {wishlistItems.length}</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="neo-panel">
          <p>No saved items yet.</p>
          <Link to="/products" className="nav-link">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="wishlist-list">
          {wishlistItems.map((item) => (
            <article key={item.productId} className="neo-panel wishlist-item">
              <div>
                <h3>{item.title}</h3>
                <p>Product ID: {item.productId}</p>
              </div>

              <div className="wishlist-item__actions">
                <Link
                  to={`/products/${item.productId}`}
                  className="neo-btn neo-btn--cart"
                >
                  View
                </Link>
                <button
                  type="button"
                  className="neo-btn"
                  onClick={() => handleRemove(item)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default WishlistPage;
