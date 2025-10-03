import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Header from "./components/Header";
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Profile from "./pages/Profile";
import EditProfile from './pages/EditProfile.tsx';
import './ProductCatalogue.css';

function ProductCatalogue() {
  return (
    <Router>
      <div className="ProductCatalogue">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/products" element={<ProductCatalogue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default ProductCatalogue;