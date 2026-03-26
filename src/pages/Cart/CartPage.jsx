import { useCart } from "../../hooks/useCart";

function CartPage() {
  const { cartItemCount } = useCart();

  return (
    <section className="page">
      <div className="neo-panel">
        <h2>Cart</h2>
        <p>Total items in cart: {cartItemCount}</p>
      </div>
    </section>
  );
}

export default CartPage;
