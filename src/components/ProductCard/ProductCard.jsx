import { FaCartPlus, FaHeart, FaStar, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useMemo } from "react";
import SafeImage from "../SafeImage/SafeImage";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { formatCurrency, usdToInr } from "../../utils/helpers";

function ProductCard({ product }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const pid = Number(product?.id);
  const valid = Boolean(product && Number.isInteger(pid) && pid >= 1);

  const cartItem = useMemo(
    () => cartItems.find((item) => item.productId === pid),
    [cartItems, pid],
  );

  const isWishlisted = wishlistItems.some(
    (item) => Number(item.productId) === pid,
  );

  const handleAddToCart = () => {
    if (!valid) {
      toast.error("Could not add this product to the cart.");
      return;
    }
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    if (!valid) {
      toast.error("Could not update the wishlist.");
      return;
    }
    toggleWishlist(product);
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (!valid) {
    return null;
  }

  return (
    <article className="product-card">
      <Link to={`/products/${pid}`} className="product-card__image-wrap">
        <SafeImage
          src={product.image}
          alt={product.title ?? "Product"}
          className="product-card__image"
          wrapperClassName="product-card__image product-card__image--placeholder"
        />
      </Link>

      <div className="product-card__content">
        <span className="product-chip">{product.category}</span>
        <Link to={`/products/${pid}`}>
          <h3 className="product-card__title">{product.title}</h3>
        </Link>

        <div className="product-card__meta">
          <strong className="product-price">
            {formatCurrency(usdToInr(product.price))}
          </strong>
          <span className="product-rating">
            <FaStar /> {product.rating?.rate ?? 0}
          </span>
        </div>

        <div className="product-card__actions">
          {cartItem ? (
            <div className="qty-control" aria-label="Quantity controls">
              <button
                type="button"
                className="neo-btn"
                onClick={() => updateQuantity(pid, cartItem.quantity - 1)}
              >
                <FaMinus />
              </button>
              <span className="qty-pill">{cartItem.quantity}</span>
              <button
                type="button"
                className="neo-btn"
                onClick={() => updateQuantity(pid, cartItem.quantity + 1)}
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="neo-btn neo-btn--cart"
              onClick={handleAddToCart}
            >
              <FaCartPlus /> Add
            </button>
          )}
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
