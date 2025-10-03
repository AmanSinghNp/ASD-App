import React, { useMemo, useState } from "react";
import "./Checkout.css";
import { useCartContext } from "./context/CartContext";

const Checkout: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    totalPrice: ctxTotalPrice,
  } = useCartContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    postcode: "",
    country: "",
    paymentMethod: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  // shipping in dollars; we'll use cents internally
  const shippingPriceDollars = 15;
  const shippingPriceCents = Math.round(shippingPriceDollars * 100);

  // defensive helper (same logic as context helper)
  const getPriceCents = (product: any): number => {
    if (!product) return 0;
    if (
      typeof product.priceCents !== "undefined" &&
      product.priceCents !== null
    ) {
      const n = Number(product.priceCents);
      if (!Number.isNaN(n)) return Math.round(n);
    }
    if (typeof product.price !== "undefined" && product.price !== null) {
      const n = Number(product.price);
      if (!Number.isNaN(n)) return Math.round(n * 100);
    }
    return 0;
  };

  const subtotalCents = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const priceCents = getPriceCents(item.product);
      const qty = Number(item.quantity) || 0;
      return sum + priceCents * qty;
    }, 0);
  }, [cartItems]);

  const totalCents = subtotalCents + shippingPriceCents;

  // debug logs — remove if not needed
  // console.debug({ cartItems, subtotalCents, shippingPriceCents, totalCents, ctxTotalPrice });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...formData,
      items: cartItems,
      totals: {
        subtotal: subtotalCents / 100,
        shipping: shippingPriceCents / 100,
        total: totalCents / 100,
      },
    };

    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    alert(result.message ?? "Order response received");
  };

  return (
    <div className="checkout-page">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        {/* contact / shipping fields (same as before) */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => {
                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFormData({ ...formData, firstName: val });
              }}
              required
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => {
                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFormData({ ...formData, lastName: val });
              }}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Shipping Address</h3>
          <div className="form-row">
            <input
              name="address"
              placeholder="Street Address"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input name="state" placeholder="State" onChange={handleChange} />
            <input
              name="postcode"
              placeholder="Postcode"
              onChange={handleChange}
              required
            />
          </div>
          <select
            name="country"
            onChange={handleChange}
            value={formData.country}
          >
            <option value="">Select Country</option>
            <option value="Australia">Australia</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>

        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />
              <span>Credit / Debit Card</span>
            </label>

            {formData.paymentMethod === "card" && (
              <div className="card-details">
                <div className="form-row">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      val = val.substring(0, 16);
                      val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                      setFormData({ ...formData, cardNumber: val });
                    }}
                    required
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={formData.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 4) val = val.substring(0, 4);
                      if (val.length >= 3) {
                        val = val.substring(0, 2) + "/" + val.substring(2);
                      }
                      setFormData({ ...formData, expiry: val });
                    }}
                    required
                  />

                  <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    maxLength={3}
                    value={formData.cvc}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      val = val.substring(0, 3); // limit to 3
                      setFormData({ ...formData, cvc: val });
                    }}
                    required
                  />
                </div>
              </div>
            )}

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === "paypal"}
                onChange={handleChange}
              />
              <span>PayPal</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="googlepay"
                checked={formData.paymentMethod === "googlepay"}
                onChange={handleChange}
              />
              <span>Google Pay</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="applepay"
                checked={formData.paymentMethod === "applepay"}
                onChange={handleChange}
              />
              <span>Apple Pay</span>
            </label>
          </div>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => {
            const priceCents = getPriceCents(item.product);
            const lineTotal = (priceCents * (Number(item.quantity) || 0)) / 100;
            return (
              <div className="order-item" key={item.product.id}>
                <div>
                  <p>
                    {item.product.name} x {item.quantity}
                  </p>
                  <span>${lineTotal.toFixed(2)}</span>
                </div>
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => removeFromCart(item.product.id)}
                >
                  x
                </button>
              </div>
            );
          })
        )}
        {/* testing */}
        <div className="summary-details">
          <p>
            Subtotal: <span>${(subtotalCents / 100).toFixed(2)}</span>
          </p>
          <p>
            Shipping: <span>${(shippingPriceCents / 100).toFixed(2)}</span>
          </p>
          <h4>
            Total: <span>${(totalCents / 100).toFixed(2)}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
