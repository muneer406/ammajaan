import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { formatCurrency } from "../../utils/helpers";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const isWishlisted = wishlistItems.some(
    (item) => item.productId === product.id,
  );

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__image"
        />
      </Link>

      <div className="product-card__content">
        <span className="product-chip">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-card__title">{product.title}</h3>
        </Link>

        <div className="product-card__meta">
          <strong className="product-price">
            {formatCurrency(product.price * 86)}
          </strong>
          <span className="product-rating">
            <FaStar /> {product.rating?.rate ?? 0}
          </span>
        </div>

        <div className="product-card__actions">
          <button
            type="button"
            className="neo-btn neo-btn--cart"
            onClick={handleAddToCart}
          >
            <FaCartPlus /> Add
          </button>
          <button
            type="button"
            className="neo-btn neo-btn--wish"
            onClick={handleWishlist}
            aria-pressed={isWishlisted}
          >
            <FaHeart /> {isWishlisted ? "Saved" : "Wishlist"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
