import { useCart } from "../../hooks/useCart";

function CheckoutPage() {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.18;

  return (
    <section className="page">
      <div className="neo-panel">
        <h2>Checkout Summary</h2>
        <p>Subtotal: Rs. {subtotal.toFixed(2)}</p>
        <p>Tax (18%): Rs. {tax.toFixed(2)}</p>
        <p>Total: Rs. {(subtotal + tax).toFixed(2)}</p>
      </div>
    </section>
  );
}

export default CheckoutPage;
