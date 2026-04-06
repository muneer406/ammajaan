import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { useCart } from "../../hooks/useCart";
import { useOrders } from "../../hooks/useOrders";
import { getRequestErrorMessage } from "../../utils/errors";
import {
  formatCurrency,
  getCartTotals,
  TAX_RATE,
  usdToInr,
} from "../../utils/helpers";

const checkoutSchema = yup
  .object({
    fullName: yup.string().trim().min(3).required("Full name is required"),
    email: yup.string().trim().email().required("Email is required"),
    address: yup.string().trim().min(8).required("Address is required"),
    city: yup.string().trim().required("City is required"),
    pinCode: yup
      .string()
      .trim()
      .matches(/^\d{6}$/, "PIN code must be 6 digits")
      .required("PIN code is required"),
  })
  .required();

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { subtotal, tax, total } = getCartTotals(cartItems);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      pinCode: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const orderId = uuidv4().slice(0, 8).toUpperCase();

      const order = {
        orderId,
        timestamp: Date.now(),
        items: cartItems,
        subtotal,
        tax,
        total,
        customerName: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pinCode: formData.pinCode,
      };

      addOrder(order);
      toast.success(`Order #${orderId} placed successfully`);
      clearCart();
      reset();
    } catch (err) {
      toast.error(
        getRequestErrorMessage(
          err,
          "Could not complete checkout. Please try again.",
        ),
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="page">
        <div className="neo-hero">
          <h2>Checkout Summary</h2>
          <p>Your cart is empty — add items before checkout.</p>
        </div>
        <div className="neo-panel">
          <Link to="/products" className="nav-link">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="neo-hero">
        <h2>Checkout Summary</h2>
        <p>Review your order and enter delivery details.</p>
      </div>

      <div className="checkout-layout">
        <form
          className="neo-panel checkout-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="control-block">
            <label htmlFor="fullName" className="control-label">
              Full Name
            </label>
            <input
              id="fullName"
              className="neo-input"
              {...register("fullName")}
            />
            {errors.fullName && (
              <small className="form-error">{errors.fullName.message}</small>
            )}
          </div>

          <div className="control-block">
            <label htmlFor="email" className="control-label">
              Email
            </label>
            <input id="email" className="neo-input" {...register("email")} />
            {errors.email && (
              <small className="form-error">{errors.email.message}</small>
            )}
          </div>

          <div className="control-block">
            <label htmlFor="address" className="control-label">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              className="neo-input"
              {...register("address")}
            />
            {errors.address && (
              <small className="form-error">{errors.address.message}</small>
            )}
          </div>

          <div className="checkout-grid-2">
            <div className="control-block">
              <label htmlFor="city" className="control-label">
                City
              </label>
              <input id="city" className="neo-input" {...register("city")} />
              {errors.city && (
                <small className="form-error">{errors.city.message}</small>
              )}
            </div>

            <div className="control-block">
              <label htmlFor="pinCode" className="control-label">
                PIN Code
              </label>
              <input
                id="pinCode"
                className="neo-input"
                {...register("pinCode")}
              />
              {errors.pinCode && (
                <small className="form-error">{errors.pinCode.message}</small>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="neo-btn neo-btn--cart"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing..." : "Place Order"}
          </button>
        </form>

        <aside className="neo-panel checkout-summary">
          <h3>Order Summary</h3>
          <ul className="checkout-lines" aria-label="Cart line items">
            {cartItems.map((item) => {
              const line = usdToInr(item.price) * item.quantity;
              return (
                <li key={item.productId} className="checkout-line">
                  <span className="checkout-line__title">
                    {item.title}{" "}
                    <span className="checkout-line__qty">
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="checkout-line__amount">
                    {formatCurrency(line)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="checkout-totals">
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            <p>
              Tax ({Math.round(TAX_RATE * 100)}%): {formatCurrency(tax)}
            </p>
            <p>
              <strong>Total: {formatCurrency(total)}</strong>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
