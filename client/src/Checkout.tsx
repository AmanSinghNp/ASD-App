import React, { useState } from "react";
import "./Checkout.css";

interface Item {
  id: number;
  name: string;
  price: number;
}

// testing 11/09

const Checkout: React.FC = () => {
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

  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const shippingPrice = 15;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const price = parseFloat(newItemPrice);
    if (!newItemName || isNaN(price)) return;

    const newItem: Item = {
      id: Date.now(),
      name: newItemName,
      price,
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPrice("");
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + shippingPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <div className="checkout-page">
      {/* Left Side: Original Form */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
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

        {/* Shipping Address */}
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
            <option value="Brazil">Brazil</option>
            <option value="Canada">Canada</option>
            <option value="China">China</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Hong Kong">Hong Kong</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Italy">Italy</option>
            <option value="Japan">Japan</option>
            <option value="Mexico">Mexico</option>
            <option value="Netherlands">Netherlands</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Singapore">Singapore</option>
            <option value="South Korea">South Korea</option>
            <option value="Spain">Spain</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>
        </div>

        {/* Payment Method */}
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
                    maxLength={16}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    maxLength={4}
                    onChange={handleChange}
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

      {/* Right Side: Order Summary with item adding */}
      <div className="order-summary">
        <h3>Order Summary</h3>

        {/* Inputs to add items */}
        <div className="form-row">
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Item Price"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            step="0.01"
          />
          <button type="button" onClick={handleAddItem}>
            Add
          </button>
        </div>

        {/* Display items */}
        {items.length === 0 ? (
          <div className="order-item">
            {/* <p>Testing product Placeholder</p>
            <span>$000.00</span> */}
          </div>
        ) : (
          items.map((item) => (
            <div className="order-item" key={item.id}>
              <div>
                <p>{item.name}</p>
                <span>${item.price.toFixed(2)}</span>
              </div>
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleDeleteItem(item.id)}
              >
                x
              </button>
            </div>
          ))
        )}

        <div className="summary-details">
          <p>
            Subtotal: <span>${subtotal.toFixed(2)}</span>
          </p>
          <p>
            Shipping: <span>${shippingPrice.toFixed(2)}</span>
          </p>
          <h4>
            Total: <span>${total.toFixed(2)}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
