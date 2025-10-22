/**
 * Admin Dashboard Component - OPTIMIZED VERSION
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Fast, simplified admin interface using local data (no API calls)
 * Last Updated: 2025-10-22
 */

import React, { useState } from 'react';
import { Plus, Search, BarChart3, Package, Users, DollarSign } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import ProductForm from '../../components/admin/ProductForm';
import type { Product } from '../../types/product';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  // Use optimized hooks for data management
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    createProduct,
    updateProduct,
    deleteProduct
  } = useAdminProducts();
  
  const { 
    orders, 
    analytics, 
    searchQuery: orderSearchQuery, 
    setSearchQuery: setOrderSearchQuery,
    selectedStatus,
    setSelectedStatus,
    statusOptions,
    updateOrderStatus
  } = useAdmin();

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };

  const handleSaveProduct = (productData: any) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = updateProduct(editingProduct.id, productData);
        if (updatedProduct) {
          console.log('Product updated successfully:', updatedProduct);
        }
      } else {
        // Create new product
        const newProduct = createProduct(productData);
        console.log('Product created successfully:', newProduct);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error; // Re-throw to let ProductForm handle the error display
    }
  };

  // Product management functions
  const handleRemoveProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to remove this product? This action cannot be undone.')) {
      const success = deleteProduct(productId);
      if (success) {
        console.log('Product removed successfully');
      } else {
        console.error('Failed to remove product');
      }
    }
  };

  const handleToggleProductStatus = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedProduct = updateProduct(productId, { isActive: !product.isActive });
      if (updatedProduct) {
        console.log(`Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`);
      }
    }
  };

  // Order status update
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

  return (
    <div className="admin-dashboard" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Admin Dashboard</h1>
        <p style={{ color: '#666' }}>Manage products, orders, and view analytics</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'products' ? '#493aecff' : 'transparent',
            color: activeTab === 'products' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <Package style={{ marginRight: '8px', display: 'inline' }} />
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'orders' ? '#493aecff' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <Users style={{ marginRight: '8px', display: 'inline' }} />
          Orders
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'analytics' ? '#493aecff' : 'transparent',
            color: activeTab === 'analytics' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <BarChart3 style={{ marginRight: '8px', display: 'inline' }} />
          Analytics
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>Product Management</h2>
            <button
              onClick={handleAddProduct}
              style={{
                padding: '10px 20px',
                backgroundColor: '#493aecff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {/* Product Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minWidth: '200px'
                }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {products.map(product => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '12px'
                  }}
                />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h3>
                <p style={{ color: '#666', margin: '0 0 8px 0', fontSize: '14px' }}>
                  {product.category}
                </p>
                <p style={{ 
                  fontWeight: 'bold', 
                  color: '#493aecff', 
                  margin: '0 0 8px 0' 
                }}>
                  ${(product.priceCents / 100).toFixed(2)}
                </p>
                <p style={{ 
                  color: product.stockQty > 0 ? 'green' : 'red',
                  margin: '0 0 12px 0',
                  fontSize: '14px'
                }}>
                  Stock: {product.stockQty}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleProductStatus(product.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: product.isActive ? '#fef3c7' : '#d1fae5',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: product.isActive ? '#92400e' : '#065f46'
                    }}
                  >
                    {product.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fee2e2',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#dc2626'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Order Management</h2>
          
          {/* Order Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minWidth: '200px'
                }}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Orders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                      {order.customerName}
                    </h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {order.id} • {order.deliveryMethod}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      ${order.total.toFixed(2)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <p style={{ margin: '0 0 4px 0' }}>{order.email}</p>
                  <p style={{ margin: '0' }}>{order.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Analytics Dashboard</h2>
          
          {/* Analytics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <DollarSign size={24} color="#493aecff" />
                <h3 style={{ margin: '0 0 0 12px', fontSize: '18px' }}>Total Revenue</h3>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
                ${analytics.sales.totalRevenue.toFixed(2)}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                +{analytics.sales.growthRate}% from last period
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Package size={24} color="#493aecff" />
                <h3 style={{ margin: '0 0 0 12px', fontSize: '18px' }}>Total Orders</h3>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
                {analytics.sales.totalOrders}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                Avg: ${analytics.sales.averageOrderValue.toFixed(2)}
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <BarChart3 size={24} color="#493aecff" />
                <h3 style={{ margin: '0 0 0 12px', fontSize: '18px' }}>Active Products</h3>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#333' }}>
                {analytics.products.activeProducts}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                {analytics.products.lowStockProducts} low stock
              </p>
            </div>
          </div>

          {/* Top Selling Products */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Top Selling Products</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics.products.topSelling.map((product: any, index: number) => (
                <div key={product.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
                      #{index + 1} {product.name}
                    </p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      {product.sales} sales
                    </p>
                  </div>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#493aecff' }}>
                    ${product.revenue.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={handleCloseForm}
        isOpen={showProductForm}
      />
    </div>
  );
};