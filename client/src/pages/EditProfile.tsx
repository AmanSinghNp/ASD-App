import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

interface Customer {
  id: number;
  name: string;
  email: string;
}

function EditProfile() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch current user data from /profile
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!token) {
        setMessage("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setMessage(data.error || "Failed to fetch user data.");
          setLoading(false);
          return;
        }

        const data: Customer = await response.json();
        setCustomer(data);
        setName(data.name);
        setEmail(data.email);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [token]);

  // Handle form submit using PUT /profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to update profile.");
        return;
      }

      // Update the token if backend returned new one (optional)
      // Or request new JWT from a refresh endpoint
      // For simplicity, backend could return new JWT here
      // Example: data.token
      if (data.token) localStorage.setItem("token", data.token);

      setMessage("Profile updated successfully ✅");
      navigate("/profile"); // redirect back to profile page
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong ❌");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth-container">
      <h2>Edit Profile</h2>
      {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
      {customer && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button 
            type="submit" 
            onClick={() => navigate("/profile")}
            style={{ backgroundColor: "#4f46e5", color: "white" }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            style={{ marginTop: "10px", backgroundColor: "gray", color: "white" }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default EditProfile;
