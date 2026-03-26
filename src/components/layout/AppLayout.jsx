import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Checkout" },
];

function AppLayout() {
  const { cartItemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="top-nav__inner">
          <div className="brand" aria-label="Site brand">
            <span className="brand__badge">NB</span>
            <span>Ammajaan Store</span>
          </div>

          <nav className="nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {item.label}
                {item.to === "/wishlist" && (
                  <span className="counter-pill">{wishlistCount}</span>
                )}
                {item.to === "/cart" && (
                  <span className="counter-pill">{cartItemCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
