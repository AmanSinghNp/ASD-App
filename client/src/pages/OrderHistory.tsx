import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // <-- import useNavigate
import "../Auth.css";

interface OrderItem {
  id: string;
  nameAtPurchase: string;
  quantity: number;
  priceCents: number;
}

interface Order {
  id: string;
  status: string;
  totalCents: number;
  items: OrderItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();  // <-- initialize navigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setOrders(data.data);
        else setError(data.error || "Failed to load orders.");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load orders.");
      });
  }, []);

  if (error) return <p className="auth-container" style={{ color: "red" }}>{error}</p>;

  return (
    <div className="auth-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ marginBottom: "20px" }}>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${(order.totalCents / 100).toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.nameAtPurchase} — {item.quantity} × ${(item.priceCents / 100).toFixed(2)}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))
      )}
      <div className="button-group">
        <button
            type="button"
            onClick={() => navigate("/auth/profile")}  // <-- navigate on click
            style={{ marginTop: "10px", backgroundColor: "gray", color: "white" }}
        >
            Cancel
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;
