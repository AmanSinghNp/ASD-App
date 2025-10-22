import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access the login function
import { API_ENDPOINTS } from "../config/api";
import "../Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "CUSTOMER" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || "Signup failed ❌");
        return;
      }

      // Expect backend to return { token, user, message }
      const data = await response.json();

      // Check if the token is returned from the backend
      if (!data.token) {
        setMessage("Signup failed, no token received ❌");
        return;
      }

      // Create the user object based on the response
      const user = { 
        id: data.id, 
        name: data.name, 
        email: data.email, 
        role: data.role 
      };

      // Log the user in immediately after signup
      login(user, data.token);

      // Store the token for persistence
      localStorage.setItem("token", data.token);

      setMessage(data.message || "Signup successful ✅");

      // Redirect the user to the homepage or another page
      navigate("/");

    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Server error. Please try again later ❌");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Signup</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
