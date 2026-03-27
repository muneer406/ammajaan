import { Link } from "react-router-dom";
import CartItem from "../../components/CartItem/CartItem";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";

function CartPage() {
  const { cartItems, cartItemCount, clearCart } = useCart();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * 86 * item.quantity,
    0,
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <section className="page">
      <div className="neo-hero">
        <h2>Cart</h2>
        <p>Total items in cart: {cartItemCount}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="neo-panel">
          <p>Your cart is empty.</p>
          <Link to="/products" className="nav-link">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <aside className="neo-panel cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            <p>Tax (18%): {formatCurrency(tax)}</p>
            <p>
              <strong>Total: {formatCurrency(total)}</strong>
            </p>

            <div className="summary-actions">
              <button type="button" className="neo-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/checkout" className="neo-btn neo-btn--cart">
                Checkout
              </Link>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartPage;
