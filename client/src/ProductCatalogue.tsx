import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './Checkout';
import './ProductCatalogue.css';
import { CartProvider } from './context/CartContext';

function ProductCatalogue() {
  return (
    <CartProvider>
      <Router>
        <div className="ProductCatalogue" style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
          <main style={{ marginTop: 0, paddingTop: 0 }}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default ProductCatalogue;