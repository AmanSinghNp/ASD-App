import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Header from "./components/Header";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile.tsx";
import Cart from "./components/Cart";
import Checkout from "./Checkout";
import "./ProductCatalogue.css";
import { CartProvider } from "./context/CartContext";

function ProductCatalogue() {
  return (
    <CartProvider>
      <Router>
        <div
          className="ProductCatalogue"
          style={{ minHeight: "100vh", width: "100%", margin: 0, padding: 0 }}
        >
          <Header />
          <main style={{ marginTop: 0, paddingTop: 0 }}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default ProductCatalogue;
