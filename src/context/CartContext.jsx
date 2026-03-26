import { useEffect, useState } from "react";
import { CartContext } from "./cartContextInstance";

const CART_KEY = "ammajaan_cart";
const WISHLIST_KEY = "ammajaan_wishlist";

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readStorage(CART_KEY, []));
  const [wishlistItems, setWishlistItems] = useState(() =>
    readStorage(WISHLIST_KEY, []),
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (!existing) {
        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
          },
        ];
      }

      return prev.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      }

      return [...prev, { productId: product.id, title: product.title }];
    });
  };

  const clearCart = () => setCartItems([]);

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    clearCart,
    cartItemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    wishlistCount: wishlistItems.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
