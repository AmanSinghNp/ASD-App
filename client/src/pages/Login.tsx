import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

      const data = await response.json();
      if (!data.token) {
        setMessage("No token received. Login failed ❌");
        return;
      }

      // localStorage.setItem("token", data.token); 
      // // save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
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
