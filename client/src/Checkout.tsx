import React, { useState, useEffect } from "react";
import "./Checkout.css";

interface Item {
  id: number;
  name: string;
  price: number;
}

interface DeliverySlot {
  slotStart: string;
  slotEnd: string;
  remaining: number;
}

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    addressLine1: "",
    suburb: "",
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
  const [deliveryMethod, setDeliveryMethod] = useState<"Delivery" | "Pickup">("Delivery");
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
  const [addressError, setAddressError] = useState("");
  const [orderResult, setOrderResult] = useState<{orderId: string, status: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const shippingPrice = 15;

  // Fetch delivery slots on component mount
  useEffect(() => {
    const fetchDeliverySlots = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`http://localhost:4000/api/delivery/slots?date=${today}`);
        const data = await response.json();
        if (data.data) {
          setDeliverySlots(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch delivery slots:', error);
      }
    };
    
    fetchDeliverySlots();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAddressError(""); // Clear address error when user types
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
  const total = subtotal + (deliveryMethod === "Delivery" ? shippingPrice : 0);

  // Validate address for delivery
  const validateAddress = async () => {
    if (deliveryMethod !== "Delivery") return true;
    
    try {
      const response = await fetch("http://localhost:4000/api/delivery/validate-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressLine1: formData.addressLine1,
          suburb: formData.suburb,
          state: formData.state,
          postcode: formData.postcode
        })
      });
      
      const result = await response.json();
      if (!result.valid) {
        setAddressError(result.error);
        return false;
      }
      return true;
    } catch (error) {
      setAddressError("Failed to validate address");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Please add items to your order");
      return;
    }

    // Validate address for delivery
    const isAddressValid = await validateAddress();
    if (!isAddressValid) return;

    // Check delivery slot for delivery
    if (deliveryMethod === "Delivery" && !selectedSlot) {
      alert("Please select a delivery slot");
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: `mock-${item.id}`, // Mock product ID for demo
          quantity: 1
        })),
        deliveryMethod,
        ...(deliveryMethod === "Delivery" && {
          address: {
            addressLine1: formData.addressLine1,
            suburb: formData.suburb,
            state: formData.state,
            postcode: formData.postcode
          },
          slotStart: selectedSlot?.slotStart,
          slotEnd: selectedSlot?.slotEnd
        })
      };

      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (result.data) {
        setOrderResult({
          orderId: result.data.orderId,
          status: result.data.status
        });
      } else {
        alert("Failed to create order: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  // Show order success
  if (orderResult) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <h2>Order Placed Successfully!</h2>
          <div className="order-details">
            <p><strong>Order ID:</strong> {orderResult.orderId}</p>
            <p><strong>Status:</strong> {orderResult.status}</p>
            <p><strong>Delivery Method:</strong> {deliveryMethod}</p>
            {deliveryMethod === "Delivery" && selectedSlot && (
              <p><strong>Delivery Slot:</strong> {new Date(selectedSlot.slotStart).toLocaleString()}</p>
            )}
          </div>
          <button 
            onClick={() => {
              setOrderResult(null);
              setItems([]);
              setSelectedSlot(null);
            }}
            className="place-order-btn"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Left Side: Original Form */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        
        {/* Delivery Method */}
        <div className="form-section">
          <h3>Delivery Method</h3>
          <div className="form-row">
            <label className="payment-option">
              <input
                type="radio"
                name="deliveryMethod"
                value="Delivery"
                checked={deliveryMethod === "Delivery"}
                onChange={(e) => setDeliveryMethod(e.target.value as "Delivery" | "Pickup")}
              />
              <span>Delivery</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="deliveryMethod"
                value="Pickup"
                checked={deliveryMethod === "Pickup"}
                onChange={(e) => setDeliveryMethod(e.target.value as "Delivery" | "Pickup")}
              />
              <span>Pickup</span>
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Delivery Address - only show for delivery */}
        {deliveryMethod === "Delivery" && (
          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-row">
              <input
                name="addressLine1"
                placeholder="Street Address"
                value={formData.addressLine1}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input 
                name="suburb" 
                placeholder="Suburb" 
                value={formData.suburb}
                onChange={handleChange}
                required
              />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="WA">WA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </div>
            <div className="form-row">
              <input
                name="postcode"
                placeholder="Postcode (4 digits)"
                value={formData.postcode}
                onChange={handleChange}
                pattern="[0-9]{4}"
                maxLength={4}
                required
              />
            </div>
            {addressError && (
              <div className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '8px'}}>
                {addressError}
              </div>
            )}
          </div>
        )}

        {/* Delivery Slot Picker - only show for delivery */}
        {deliveryMethod === "Delivery" && deliverySlots.length > 0 && (
          <div className="form-section">
            <h3>Select Delivery Slot</h3>
            <div className="delivery-slots">
              {deliverySlots.map((slot, index) => (
                <label key={index} className="payment-option">
                  <input
                    type="radio"
                    name="deliverySlot"
                    checked={selectedSlot?.slotStart === slot.slotStart}
                    onChange={() => setSelectedSlot(slot)}
                    disabled={slot.remaining === 0}
                  />
                  <span>
                    {new Date(slot.slotStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                    {new Date(slot.slotEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    {slot.remaining === 0 ? ' (Full)' : ` (${slot.remaining} available)`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

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

        <button type="submit" className="place-order-btn" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
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
          {deliveryMethod === "Delivery" && (
            <p>
              Shipping: <span>${shippingPrice.toFixed(2)}</span>
            </p>
          )}
          <h4>
            Total: <span>${total.toFixed(2)}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
