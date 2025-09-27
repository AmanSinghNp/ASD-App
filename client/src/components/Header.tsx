import { Link } from "react-router-dom";
import "../ProductCatalogue.css"; // make sure to import your CSS

function Header() {
  const token = localStorage.getItem("token");
  return (
    <header>
      <nav>
        <Link to="/">Products</Link> |{" "}
        {token ? (
          <Link to="/logout">Logout</Link>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </>
        )}
        {/* <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> */}
      </nav>
    </header>
  );
}

export default Header;
