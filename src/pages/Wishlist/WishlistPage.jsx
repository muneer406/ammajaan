import { useWishlist } from "../../hooks/useWishlist";

function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <section className="page">
      <div className="neo-panel">
        <h2>Wishlist</h2>
        <p>Saved items: {wishlistItems.length}</p>
      </div>
    </section>
  );
}

export default WishlistPage;
