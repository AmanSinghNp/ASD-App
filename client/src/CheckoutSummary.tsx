import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  postcode: string;
  country: string;
  paymentMethod: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  cart: CartItem[];
  shippingPrice: number;
}

const CheckoutSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as CheckoutData | undefined;

  if (!data) {
    return (
      <div>
        <h2>No order data found</h2>
        <button onClick={() => navigate("/")}>Back to Shop</button>
      </div>
    );
  }

  const subtotal = data.cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + data.shippingPrice;

  return (
    <div className="checkout-summary">
      <h2>Order Confirmation</h2>

      <section>
        <h3>Contact Information</h3>
        <p>
          {data.firstName} {data.lastName}
        </p>
        <p>Email: {data.email}</p>
        <p>Phone: {data.phone}</p>
      </section>

      <section>
        <h3>Shipping Address</h3>
        <p>{data.address}</p>
        <p>
          {data.state}, {data.postcode}, {data.country}
        </p>
      </section>

      <section>
        <h3>Payment Method</h3>
        <p>{data.paymentMethod}</p>
        {data.paymentMethod === "card" && (
          <p>Card: **** **** **** {data.cardNumber?.slice(-4)}</p>
        )}
      </section>

      <section>
        <h3>Order Summary</h3>
        {data.cart.map((item) => (
          <div
            key={item.id}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: ${data.shippingPrice.toFixed(2)}</p>
        <h4>Total: ${total.toFixed(2)}</h4>
      </section>
    </div>
  );
};

export default CheckoutSummary;
