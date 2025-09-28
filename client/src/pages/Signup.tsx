import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "CUSTOMER" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || "Signup failed ❌");
        return;
      }

      // Expect backend to return { token, message }
      const data = await response.json();

      // Save token so session persists
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage(data.message || "Signup successful ✅");

      // Redirect straight to product catalogue
      navigate("/products");
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
