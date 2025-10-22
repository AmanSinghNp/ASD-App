// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryInterface } from './pages/delivery/DeliveryInterface';
import ProductCatalogue from './ProductCatalogue';
import Checkout from './Checkout';
import FAQ from './pages/FAQ'; 
import LiveChat from './pages/LiveChat';
import { Settings, Truck, ShoppingCart, Package, HelpCircle } from 'lucide-react';
import './App.css';

/**
 * Navigation component for the main application header
 * Provides navigation links to different sections of the app
 */
const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (target: string) => {
    if (target === '/') {
      return location.pathname === '/';
    }
    return location.pathname === target || location.pathname.startsWith(`${target}/`);
  };

  const links = [
    { to: '/', label: 'Product Catalogue', icon: Package },
    { to: '/checkout', label: 'Checkout', icon: ShoppingCart },
    { to: '/admin', label: 'Admin Dashboard', icon: Settings },
    { to: '/delivery', label: 'Delivery Interface', icon: Truck },
    { to: '/support', label: 'Support / FAQ', icon: HelpCircle }, // ← 新增：支持中心
  ] as const;

  return (
    <nav style={{
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-sm)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem',
          gap: 'var(--spacing-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
            {/* Application title */}
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0
            }}>
              ASD App
            </h1>
            {/* Navigation links */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              {links.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      gap: 'var(--spacing-sm)',
                      backgroundColor: active ? 'var(--primary-blue-light)' : 'transparent',
                      color: active ? 'var(--primary-blue-dark)' : 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
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
    <CartProvider>
      <Router>
        <div className="App">
          {/* Global navigation header */}
          <Navigation />
          {/* Application routes */}
          <Routes>
            <Route path="/" element={<ProductCatalogue />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/delivery" element={<DeliveryInterface />} />
            <Route path="/support" element={<FAQ />} /> {/* ← 新增：FAQ 路由 */}
            <Route path="/support/chat" element={<LiveChat />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
