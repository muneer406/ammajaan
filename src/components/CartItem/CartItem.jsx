import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { formatCurrency, usdToInr } from "../../utils/helpers";

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();
  const itemPriceInr = usdToInr(item.price);
  const lineTotal = itemPriceInr * item.quantity;

  return (
    <article className="cart-item neo-panel">
      <div>
        <h3>{item.title}</h3>
        <p className="cart-item__price">{formatCurrency(itemPriceInr)} each</p>
      </div>

      <div className="cart-item__actions">
        <div className="qty-control" aria-label="Quantity controls">
          <button
            type="button"
            className="neo-btn"
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          >
            <FaMinus />
          </button>
          <span className="qty-pill">{item.quantity}</span>
          <button
            type="button"
            className="neo-btn"
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          >
            <FaPlus />
          </button>
        </div>

        <strong>{formatCurrency(lineTotal)}</strong>

        <button
          type="button"
          className="neo-btn"
          onClick={() => removeFromCart(item.productId)}
        >
          <FaTrash /> Remove
        </button>
      </div>
    </article>
  );
}

export default CartItem;
