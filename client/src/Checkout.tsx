import React, { useMemo, useState, useEffect } from "react";
import "./Checkout.css";
import { useCartContext } from "./context/CartContext";

interface DeliverySlot {
  slotStart: string;
  slotEnd: string;
  remaining: number;
}

const Checkout: React.FC = () => {
  const { cartItems, removeFromCart, totalPrice: ctxTotalPrice } = useCartContext();

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

  const shippingPriceDollars = 15;
  const shippingPriceCents = Math.round(shippingPriceDollars * 100);

  const getPriceCents = (product: any): number => {
    if (!product) return 0;
    if (typeof product.priceCents !== "undefined" && product.priceCents !== null) {
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

  const [deliveryMethod, setDeliveryMethod] = useState<"Delivery" | "Pickup">("Delivery");
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);

  const [addressError, setAddressError] = useState("");
  const [orderResult, setOrderResult] = useState<{ orderId: string; status: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const totalCents = subtotalCents + (deliveryMethod === "Delivery" ? shippingPriceCents : 0);

  useEffect(() => {
    const fetchDeliverySlots = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(`http://localhost:4000/api/delivery/slots?date=${today}`);
        const data = await response.json();
        if (data.data) {
          setDeliverySlots(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch delivery slots:", error);
      }
    };

    fetchDeliverySlots();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAddressError("");
  };

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
          postcode: formData.postcode,
        }),
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

    const isAddressValid = await validateAddress();
    if (!isAddressValid) return;

    if (deliveryMethod === "Delivery" && !selectedSlot) {
      alert("Please select a delivery slot");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((ci: any) => ({
          productId: ci.product.id,
          quantity: Number(ci.quantity) || 0,
        })),
        deliveryMethod,
        totals: {
          subtotalCents,
          shippingCents: deliveryMethod === "Delivery" ? shippingPriceCents : 0,
          totalCents,
        },
        ...(deliveryMethod === "Delivery" && {
          address: {
            addressLine1: formData.addressLine1,
            suburb: formData.suburb,
            state: formData.state,
            postcode: formData.postcode,
          },
          slotStart: selectedSlot?.slotStart,
          slotEnd: selectedSlot?.slotEnd,
        }),
      };

      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (result.data) {
        setOrderResult({ orderId: result.data.orderId, status: result.data.status });
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
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>

        {/* Delivery Method Selection */}
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

        {/* Delivery Address - Only shown for delivery method */}
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
              <div className="error-message" style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>
                {addressError}
              </div>
            )}
          </div>
        )}

        {/* Delivery Slot Selection - Only shown for delivery method */}
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
                    {new Date(slot.slotStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                    {new Date(slot.slotEnd).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {slot.remaining === 0 ? " (Full)" : ` (${slot.remaining} available)`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
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
                      val = val.substring(0, 3);
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

        <button type="submit" className="place-order-btn" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
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
        <div className="summary-details">
          <p>
            Subtotal: <span>${(subtotalCents / 100).toFixed(2)}</span>
          </p>
          <p>
            Shipping: <span>${(deliveryMethod === "Delivery" ? shippingPriceCents / 100 : 0).toFixed(2)}</span>
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
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "./Checkout.css";

/**
 * Interface for order items
 */
interface Item {
  id: number;
  name: string;
  price: number;
}

/**
 * Interface for delivery time slots
 */
interface DeliverySlot {
  slotStart: string;
  slotEnd: string;
  remaining: number;
}
=======
import React, { useMemo, useState } from "react";
import "./Checkout.css";
import { useCartContext } from "./context/CartContext";
>>>>>>> origin/dev

/**
 * Checkout component for handling order placement
 * Manages customer information, delivery options, and payment processing
 */
const Checkout: React.FC = () => {
<<<<<<< HEAD
  // Form data state for customer information
=======
  const {
    cartItems,
    removeFromCart,
    totalPrice: ctxTotalPrice,
  } = useCartContext();

>>>>>>> origin/dev
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

<<<<<<< HEAD
  // Order items and management
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  
  // Delivery method and slot selection
  const [deliveryMethod, setDeliveryMethod] = useState<"Delivery" | "Pickup">("Delivery");
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
  
  // Error handling and order status
  const [addressError, setAddressError] = useState("");
  const [orderResult, setOrderResult] = useState<{orderId: string, status: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // Fixed shipping cost for delivery orders
  const shippingPrice = 15;
=======
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
>>>>>>> origin/dev

  /**
   * Fetch available delivery slots on component mount
   * Retrieves slots for the current date from the delivery API
   */
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

  /**
   * Handle form input changes
   * Updates form data and clears address validation errors
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAddressError(""); // Clear address error when user types
  };

<<<<<<< HEAD
  /**
   * Add a new item to the order
   * Validates input and creates a new item with unique ID
   */
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

  /**
   * Remove an item from the order by ID
   */
  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculate order totals
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + (deliveryMethod === "Delivery" ? shippingPrice : 0);

  /**
   * Validate delivery address using the delivery API
   * Only validates if delivery method is selected
   * @returns Promise<boolean> - true if address is valid
   */
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

  /**
   * Handle order form submission
   * Validates order data and submits to the orders API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if items are added to order
    if (items.length === 0) {
      alert("Please add items to your order");
      return;
    }

    // Validate address for delivery orders
    const isAddressValid = await validateAddress();
    if (!isAddressValid) return;

    // Check delivery slot selection for delivery orders
    if (deliveryMethod === "Delivery" && !selectedSlot) {
      alert("Please select a delivery slot");
      return;
    }

    setLoading(true);
    
    try {
      // Prepare order data for API submission
      const orderData = {
        items: items.map(item => ({
          productId: `mock-${item.id}`, // Mock product ID for demo
          quantity: 1
        })),
        deliveryMethod,
        // Include address and delivery slot for delivery orders
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

      // Submit order to API
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
=======
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
>>>>>>> origin/dev
  };

  /**
   * Render order success screen after successful submission
   * Shows order details and option to place another order
   */
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
<<<<<<< HEAD
      {/* Left Side: Checkout Form */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        
        {/* Delivery Method Selection */}
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

        {/* Customer Contact Information */}
=======
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        {/* contact / shipping fields (same as before) */}
>>>>>>> origin/dev
        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
<<<<<<< HEAD
              onChange={handleChange}
=======
              onChange={(e) => {
                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFormData({ ...formData, firstName: val });
              }}
>>>>>>> origin/dev
              required
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
<<<<<<< HEAD
              onChange={handleChange}
=======
              onChange={(e) => {
                let val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setFormData({ ...formData, lastName: val });
              }}
>>>>>>> origin/dev
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

<<<<<<< HEAD
        {/* Delivery Address - Only shown for delivery method */}
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
            {/* Display address validation errors */}
            {addressError && (
              <div className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '8px'}}>
                {addressError}
              </div>
            )}
          </div>
        )}

        {/* Delivery Slot Selection - Only shown for delivery method */}
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

        {/* Payment Method Selection */}
=======
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

>>>>>>> origin/dev
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
<<<<<<< HEAD
            {/* Card details form - shown when card payment is selected */}
=======

>>>>>>> origin/dev
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

        {/* Submit button with loading state */}
        <button type="submit" className="place-order-btn" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>

<<<<<<< HEAD
      {/* Right Side: Order Summary and Item Management */}
      <div className="order-summary">
        <h3>Order Summary</h3>

        {/* Item Input Form */}
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

        {/* Order Items List */}
        {items.length === 0 ? (
          <div className="order-item">
            {/* Empty state - no items added yet */}
          </div>
=======
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
>>>>>>> origin/dev
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
<<<<<<< HEAD

        {/* Order Totals */}
=======
        {/* testing */}
>>>>>>> origin/dev
        <div className="summary-details">
          <p>
            Subtotal: <span>${(subtotalCents / 100).toFixed(2)}</span>
          </p>
<<<<<<< HEAD
          {deliveryMethod === "Delivery" && (
            <p>
              Shipping: <span>${shippingPrice.toFixed(2)}</span>
            </p>
          )}
=======
          <p>
            Shipping: <span>${(shippingPriceCents / 100).toFixed(2)}</span>
          </p>
>>>>>>> origin/dev
          <h4>
            Total: <span>${(totalCents / 100).toFixed(2)}</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
