import { Link } from "react-router-dom";
import "../ProductCatalogue.css"; // make sure to import your CSS

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Products</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link>
      </nav>
    </header>
  );
}

export default Header;
