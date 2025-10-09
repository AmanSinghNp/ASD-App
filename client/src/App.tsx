<<<<<<< HEAD

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
>>>>>>> origin/dev
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryInterface } from './pages/delivery/DeliveryInterface';
import ProductCatalogue from './ProductCatalogue';
import Checkout from './Checkout';
import { Settings, Truck, ShoppingCart, Package } from 'lucide-react';
import './App.css';

/**
 * Navigation component for the main application header
 * Provides navigation links to different sections of the app
 */
const Navigation: React.FC = () => {
  const location = useLocation();
  
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xl)'
          }}>
            {/* Application title */}
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              ASD App
            </h1>
            {/* Navigation links */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)'
            }}>
              {[
                { to: '/', label: 'Product Catalogue', icon: Package },
                { to: '/checkout', label: 'Checkout', icon: ShoppingCart },
                { to: '/admin', label: 'Admin Dashboard (F007)', icon: Settings },
                { to: '/delivery', label: 'Delivery Interface (F008)', icon: Truck }
              ].map(({ to, label, icon: Icon }) => (
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
                    color: location.pathname === to ? 'var(--primary-blue-dark)' : 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== to) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== to) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
