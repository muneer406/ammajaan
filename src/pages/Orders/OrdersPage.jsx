import { Link } from "react-router-dom";
import SafeImage from "../../components/SafeImage/SafeImage";
import { useOrders } from "../../hooks/useOrders";
import { formatCurrency, usdToInr } from "../../utils/helpers";

function OrdersPage() {
  const { orders } = useOrders();

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <section className="page">
        <div className="neo-hero">
          <h2>Orders</h2>
          <p>Track and manage all your orders</p>
        </div>
        <div className="neo-panel">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="nav-link">
            Start shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="neo-hero">
        <h2>Orders</h2>
        <p>Total orders: {orders.length}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.orderId} className="neo-panel order-card">
            <div className="order-header">
              <div className="order-header__info">
                <h3>Order #{order.orderId}</h3>
                <p className="order-date">{formatDate(order.timestamp)}</p>
              </div>
              <div className="order-header__status">
                <span className="order-status">Confirmed</span>
                <strong className="order-total">
                  {formatCurrency(order.total)}
                </strong>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.productId} className="order-item">
                  {item.image && (
                    <div className="order-item__image-wrap">
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        className="order-item__image"
                        wrapperClassName="order-item__image-placeholder"
                      />
                    </div>
                  )}
                  <div className="order-item__info">
                    <h4>{item.title}</h4>
                    <p>
                      {item.quantity} × {formatCurrency(usdToInr(item.price))}
                    </p>
                  </div>
                  <div className="order-item__total">
                    {formatCurrency(usdToInr(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="order-summary__row">
                <span>Subtotal:</span>
                <strong>{formatCurrency(order.subtotal)}</strong>
              </div>
              <div className="order-summary__row">
                <span>Tax:</span>
                <strong>{formatCurrency(order.tax)}</strong>
              </div>
              <div className="order-summary__row order-summary__row--total">
                <span>Total:</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </div>

            <div className="order-shipping">
              <h4>Shipping Address</h4>
              <p>
                <strong>{order.customerName}</strong>
              </p>
              <p>{order.address}</p>
              <p>
                {order.city}, {order.pinCode}
              </p>
              <p>Email: {order.email}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OrdersPage;
