import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

interface Customer {
  id: number;
  name: string;
  email: string;
}

function Profile() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch user data on mount
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || "Failed to fetch user data.");
          setLoading(false);
          return;
        }

        const data: Customer = await response.json(); // matches Prisma select
        setCustomer(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [token]);

  const handleDelete = async () => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const response = await fetch("http://localhost:3000/auth/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Failed to delete account.");
        return;
      }

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="auth-container">
      <h2>Your Profile</h2>
      {customer && (
        <>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>

          <button onClick={() => navigate("/edit-profile")}>Edit Account</button>
          <button onClick={handleDelete} style={{ backgroundColor: "red", marginTop: "10px" }}>
            Delete Account
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;
