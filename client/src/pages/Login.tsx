import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Import useAuth to use login
import "../Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  // Get the login function from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // only if backend sets cookies
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({}));
        setMessage(error || "Wrong credentials ❌");
        return;
      }

      const data = await response.json();  // This contains the token and potentially user data
      if (!data.token) {
        setMessage("No token received. Login failed ❌");
        return;
      }

      // Assuming your response contains the user object and the token
      const user = { name: data.name, email: data.email, id: data.id, role: data.role };  // Adjust based on response structure

      login(user);  // Update the AuthContext with the logged-in user's details

      // Optionally store the token in localStorage for persistence
      localStorage.setItem("token", data.token);

      setMessage("Login successful ✅");

      // Redirect to Product Catalogue (homepage)
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
