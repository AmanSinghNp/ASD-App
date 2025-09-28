import { Link, useNavigate } from "react-router-dom";
import "../ProductCatalogue.css"; // make sure to import your CSS

function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/"); // redirect to products page
  };

  return (
    <header>
      <nav>
        <Link to="/">Products</Link> |{" "}
        {token ? (
          <>
            <Link to="/profile">Profile</Link> |{" "}
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
