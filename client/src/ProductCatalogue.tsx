// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProductList from "./components/ProductList";
// import ProductDetail from "./components/ProductDetail";
// import "./ProductCatalogue.css";

// function ProductCatalogue() {
//   return (
//     <Router>
//       <div className="ProductCatalogue">
//         <main>
//           <Routes>
//             <Route path="/" element={<ProductList />} />
//             <Route path="/product/:productId" element={<ProductDetail />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default ProductCatalogue;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Checkout from "./Checkout";
import "./ProductCatalogue.css";
import { CartProvider } from "./components/CartContext";

function ProductCatalogue() {
  return (
    <CartProvider>
      <Router>
        <div className="ProductCatalogue">
          {/* Top Nav Bar */}
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "#f8f8f8",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {/* Catalogue Button */}
              <Link to="/">
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  📦 Catalogue
                </button>
              </Link>

              {/* Cart Button */}
              <Link to="/checkout">
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  🛒 Cart
                </button>
              </Link>
            </div>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default ProductCatalogue;
