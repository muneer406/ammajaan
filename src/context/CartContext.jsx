import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CartContext } from "./cartContextInstance";

const CART_KEY = "ammajaan_cart";
const WISHLIST_KEY = "ammajaan_wishlist";

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    toast.warning(
      "Could not save to device storage. Cart and wishlist may reset when you close the tab.",
      { toastId: "storage-warning" }
    );
  }
}

function sanitizeCartItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const productId = Number(raw.productId);
  const price = Number(raw.price);
  const quantity = Math.floor(Number(raw.quantity));
  const title = raw.title != null ? String(raw.title) : "";
  if (!Number.isInteger(productId) || productId < 1) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!Number.isInteger(quantity) || quantity < 1) return null;
  return {
    productId,
    title: title.trim() ? title : "Product",
    price,
    quantity,
  };
}

function sanitizeWishlistItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const productId = Number(raw.productId);
  if (!Number.isInteger(productId) || productId < 1) return null;
  const title = raw.title != null ? String(raw.title) : "";
  const next = {
    productId,
    title: title.trim() ? title : "Product",
  };
  if (raw.image != null && String(raw.image).trim()) {
    next.image = String(raw.image);
  }
  const p = Number(raw.price);
  if (Number.isFinite(p) && p >= 0) {
    next.price = p;
  }
  return next;
}

const readStorage = (key, sanitizer) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizer).filter(Boolean);
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() =>
    readStorage(CART_KEY, sanitizeCartItem)
  );
  const [wishlistItems, setWishlistItems] = useState(() =>
    readStorage(WISHLIST_KEY, sanitizeWishlistItem)
  );

  useEffect(() => {
    safeWrite(CART_KEY, cartItems);
  }, [cartItems]);

  useEffect(() => {
    safeWrite(WISHLIST_KEY, wishlistItems);
  }, [wishlistItems]);

  const addToCart = (product) => {
    const id = Number(product?.id);
    const price = Number(product?.price);
    if (
      !Number.isInteger(id) ||
      id < 1 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error("Could not add this product to the cart.");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === id);
      if (!existing) {
        return [
          ...prev,
          {
            productId: id,
            title: String(product.title ?? "Product"),
            price,
            quantity: 1,
          },
        ];
      }

      return prev.map((item) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    const pid = Number(productId);
    if (!Number.isInteger(pid)) return;
    setCartItems((prev) => prev.filter((item) => item.productId !== pid));
  };

  const updateQuantity = (productId, quantity) => {
    const pid = Number(productId);
    const qty = Math.floor(Number(quantity));
    if (!Number.isInteger(pid) || pid < 1) return;
    if (!Number.isInteger(qty) || qty < 1) {
      removeFromCart(pid);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === pid ? { ...item, quantity: qty } : item
      )
    );
  };

  const toggleWishlist = (product) => {
    const id = Number(product?.id);
    if (!Number.isInteger(id) || id < 1) {
      toast.error("Could not update the wishlist for this product.");
      return;
    }

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.productId === id);
      if (exists) {
        return prev.filter((item) => item.productId !== id);
      }

      const price = Number(product?.price);
      const next = {
        productId: id,
        title: String(product.title ?? "Product"),
      };
      if (product?.image != null && String(product.image).trim()) {
        next.image = String(product.image);
      }
      if (Number.isFinite(price) && price >= 0) {
        next.price = price;
      }
      return [...prev, next];
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
