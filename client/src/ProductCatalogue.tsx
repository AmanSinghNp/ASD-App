import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import "./ProductCatalogue.css";

function ProductCatalogue() {
  return (
    <Router>
      <div className="ProductCatalogue">
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default ProductCatalogue;
