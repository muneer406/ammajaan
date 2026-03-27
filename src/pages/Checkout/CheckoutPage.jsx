import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/helpers";

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
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * 86 * item.quantity,
    0,
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

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

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Order placed successfully");
    clearCart();
    reset();
  };

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
          <p>Items: {cartItems.length}</p>
          <p>Subtotal: {formatCurrency(subtotal)}</p>
          <p>Tax (18%): {formatCurrency(tax)}</p>
          <p>
            <strong>Total: {formatCurrency(total)}</strong>
          </p>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
