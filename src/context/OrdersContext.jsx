import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrdersContext } from "./ordersContextInstance";

const ORDERS_KEY = "ammajaan_orders";

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    toast.warning(
      "Could not save to device storage. Orders may be lost when you close the tab.",
      { toastId: "orders-storage-warning" },
    );
  }
}

function sanitizeOrder(raw) {
  if (!raw || typeof raw !== "object") return null;

  const orderId = raw.orderId != null ? String(raw.orderId) : null;
  const timestamp = Number(raw.timestamp);
  const items = Array.isArray(raw.items) ? raw.items : [];
  const subtotal = Number(raw.subtotal);
  const tax = Number(raw.tax);
  const total = Number(raw.total);
  const customerName = raw.customerName != null ? String(raw.customerName) : "";
  const email = raw.email != null ? String(raw.email) : "";
  const address = raw.address != null ? String(raw.address) : "";
  const city = raw.city != null ? String(raw.city) : "";
  const pinCode = raw.pinCode != null ? String(raw.pinCode) : "";

  if (!orderId) return null;
  if (!Number.isFinite(timestamp) || timestamp < 0) return null;
  if (!Number.isFinite(subtotal) || subtotal < 0) return null;
  if (!Number.isFinite(tax) || tax < 0) return null;
  if (!Number.isFinite(total) || total < 0) return null;
  if (items.length === 0) return null;

  const sanitizedItems = items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const productId = Number(item.productId);
      const price = Number(item.price);
      const quantity = Math.floor(Number(item.quantity));
      const title = item.title != null ? String(item.title) : "";

      if (!Number.isInteger(productId) || productId < 1) return null;
      if (!Number.isFinite(price) || price < 0) return null;
      if (!Number.isInteger(quantity) || quantity < 1) return null;

      const product = {
        productId,
        title: title.trim() ? title : "Product",
        price,
        quantity,
      };

      if (item.image != null && String(item.image).trim()) {
        product.image = String(item.image);
      }

      return product;
    })
    .filter(Boolean);

  if (sanitizedItems.length === 0) return null;

  return {
    orderId,
    timestamp,
    items: sanitizedItems,
    subtotal,
    tax,
    total,
    customerName: customerName.trim() ? customerName : "Customer",
    email: email.trim() ? email : "",
    address: address.trim() ? address : "",
    city: city.trim() ? city : "",
    pinCode: pinCode.trim() ? pinCode : "",
  };
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

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() =>
    readStorage(ORDERS_KEY, sanitizeOrder),
  );

  useEffect(() => {
    safeWrite(ORDERS_KEY, orders);
  }, [orders]);

  const addOrder = (order) => {
    if (
      !order ||
      typeof order !== "object" ||
      !order.orderId ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      toast.error("Could not create order.");
      return;
    }

    setOrders((prev) => [order, ...prev]);
  };

  const value = {
    orders,
    addOrder,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}
