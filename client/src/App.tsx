// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';  // Import useNavigate
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';  // Import AuthProvider
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryInterface } from './pages/delivery/DeliveryInterface';
import ProductCatalogue from './ProductCatalogue';
import Cart from './components/Cart';
import Checkout from './Checkout';
import FAQ from './pages/FAQ'; 
import { Settings, Truck, ShoppingCart, Package, User, LogIn, Edit, LogOut, HelpCircle } from 'lucide-react';
import './App.css';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import EditProfile from './pages/EditProfile';
import OrderHistory from './pages/OrderHistory';

/**
 * Navigation component for the main application header
 * Provides navigation links to different sections of the app
 */
const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();  // Hook to navigate programmatically
  const { user, logout } = useAuth(); // Get user state and logout function from context

  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;  // Cast the target to HTMLElement
    target.style.backgroundColor = 'var(--bg-tertiary)';
    target.style.color = 'var(--text-primary)';
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;  // Cast the target to HTMLElement
    if (location.pathname !== target.getAttribute('href')) {
      target.style.backgroundColor = 'transparent';
      target.style.color = 'var(--text-secondary)';
    }
  };

  const handleLogout = () => {
    logout();  // Perform logout
    navigate('/');  // Redirect to home page after logout
  };

    return (
    <nav style={{
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-sm)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem',
          gap: 'var(--spacing-lg)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xl)',
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              ASD App
            </h1>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
            }}>

              {/* Navigation links */}
              {[ 
                { to: '/', label: 'Product Catalogue', icon: Package },
                { to: '/cart', label: 'Cart', icon: ShoppingCart },
                { to: '/checkout', label: 'Checkout', icon: ShoppingCart },
                { to: '/admin', label: 'Admin Dashboard', icon: Settings },
                { to: '/delivery', label: 'Delivery Interface', icon: Truck },
                { to: '/support', label: 'Support / FAQ', icon: HelpCircle },
                { to: '/auth/profile', label: 'Profile', icon: User }, // Only show this if user is logged in
              ].map(({ to, label, icon: Icon}) => (
                (to === '/auth/profile' && user) || to !== '/auth/profile' ? (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      gap: 'var(--spacing-sm)',
                      backgroundColor: location.pathname === to ? 'var(--primary-blue-light)' : 'transparent',
                      color: location.pathname === to ? 'var(--primary-blue-dark)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {Icon && <Icon size={16} />}
                    {label}
                  </Link>
                ) : null
              ))}

              {/* Conditionally render Login and Signup links if the user is not logged in */}
              {!user && (
                <>
                  <Link
                    to="/auth/login"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      gap: 'var(--spacing-sm)',
                      backgroundColor: location.pathname === '/auth/login' ? 'var(--primary-blue-light)' : 'transparent',
                      color: location.pathname === '/auth/login' ? 'var(--primary-blue-dark)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <LogIn size={16} />
                    Login
                  </Link>

                  <Link
                    to="/auth/signup"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      gap: 'var(--spacing-sm)',
                      backgroundColor: location.pathname === '/auth/signup' ? 'var(--primary-blue-light)' : 'transparent',
                      color: location.pathname === '/auth/signup' ? 'var(--primary-blue-dark)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <User size={16} />
                    Signup
                  </Link>
                </>
              )}

              {/* Show Logout button if user is logged in */}
              {user && (
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    gap: 'var(--spacing-sm)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Main App component
 * Sets up routing and navigation for the entire application
 */
function App() {
  return (
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
      <CartProvider>
        <Router>
          <div className="App">
            {/* Global navigation header */}
            <Navigation />
            {/* Application routes */}
            <Routes>
              <Route path="*" element={<ProductCatalogue />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/delivery" element={<DeliveryInterface />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/profile" element={<Profile />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/orders/my-orders" element={<OrderHistory />}></Route>
              <Route path="/support" element={<FAQ />} /> {/* ← 新增：FAQ 路由 */}
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
