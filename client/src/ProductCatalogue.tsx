import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import './ProductCatalogue.css';

function ProductCatalogue() {
  return (
    <Router>
      <div className="ProductCatalogue">
        <header>
          <nav>
            <Link to="products">Products</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/signup">Signup</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/products" element={<ProductCatalogue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default ProductCatalogue;