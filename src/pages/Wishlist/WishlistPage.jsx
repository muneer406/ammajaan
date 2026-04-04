import { Link } from "react-router-dom";
import SafeImage from "../../components/SafeImage/SafeImage";
import { useWishlist } from "../../hooks/useWishlist";
import { formatCurrency, usdToInr } from "../../utils/helpers";

function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  const handleRemove = (item) => {
    toggleWishlist({
      id: item.productId,
      title: item.title,
      image: item.image,
      price: item.price,
    });
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
              <div className="wishlist-item__main">
                {item.image ? (
                  <Link
                    to={`/products/${item.productId}`}
                    className="wishlist-item__thumb-wrap"
                  >
                    <SafeImage
                      src={item.image}
                      alt=""
                      className="wishlist-item__thumb"
                      wrapperClassName="wishlist-item__thumb wishlist-item__thumb--placeholder"
                    />
                  </Link>
                ) : (
                  <div
                    className="wishlist-item__thumb-wrap wishlist-item__thumb-wrap--empty"
                    aria-hidden
                  />
                )}

                <div className="wishlist-item__info">
                  <Link to={`/products/${item.productId}`}>
                    <h3>{item.title}</h3>
                  </Link>
                  {item.price != null ? (
                    <p className="wishlist-item__price">
                      {formatCurrency(usdToInr(item.price))}
                    </p>
                  ) : (
                    <p className="wishlist-item__meta">Saved product</p>
                  )}
                </div>
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
