import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import type { Product, ProductFormData } from '../../types/product';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToRemove, setProductToRemove] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load products and analytics on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('http://localhost:4000/api/products?includeHidden=true');
        const productsData = await productsResponse.json();
        if (productsData.data) {
          setProducts(productsData.data);
        }
        
        // Fetch analytics
        const analyticsResponse = await fetch('http://localhost:4000/api/analytics');
        const analyticsData = await analyticsResponse.json();
        if (analyticsData.data) {
          setAnalytics(analyticsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on search, category, and status
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedStatus !== '') {
      const isActive = selectedStatus === 'active';
      filtered = filtered.filter(product => product.isActive === isActive);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (formData: ProductFormData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`http://localhost:4000/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (result.data) {
          setProducts(prev => prev.map(product =>
            product.id === editingProduct.id ? result.data : product
          ));
        }
      } else {
        // Add new product
        const response = await fetch('http://localhost:4000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (result.data) {
          setProducts(prev => [...prev, result.data]);
        }
      }
      setShowProductForm(false);
      setEditingProduct(undefined);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleToggleActive = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}/hide`, {
        method: 'PATCH'
      });
      const result = await response.json();
      if (result.data) {
        setProducts(prev => prev.map(product =>
          product.id === productId ? result.data : product
        ));
      }
    } catch (error) {
      console.error('Failed to toggle product:', error);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setProductToRemove(productId);
    setShowConfirmDialog(true);
  };

  const confirmRemove = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productToRemove}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProducts(prev => prev.filter(product => product.id !== productToRemove));
      }
    } catch (error) {
      console.error('Failed to remove product:', error);
    }
    setShowConfirmDialog(false);
    setProductToRemove('');
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--spacing-2xl) 0'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--spacing-lg)'
          }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Product Management
            </h1>
            <button
              onClick={handleAddProduct}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                gap: 'var(--spacing-sm)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {analytics && (
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: 'var(--spacing-2xl)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-lg)',
              margin: 0
            }}>
              Analytics (Last 7 Days)
            </h2>
            
            {/* KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <div style={{
                backgroundColor: 'var(--primary-blue-light)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--primary-blue-light)'
              }}>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: 'var(--primary-blue-dark)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {formatPrice(analytics.kpis.revenueTotalCents)}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--primary-blue-dark)',
                  fontWeight: '500'
                }}>
                  Total Revenue
                </div>
              </div>
              <div style={{
                backgroundColor: '#f0fdf4',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#166534',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {analytics.kpis.ordersCount}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#166534',
                  fontWeight: '500'
                }}>
                  Total Orders
                </div>
              </div>
              <div style={{
                backgroundColor: '#faf5ff',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #e9d5ff'
              }}>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#7c3aed',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {formatPrice(analytics.kpis.avgOrderValueCents)}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#7c3aed',
                  fontWeight: '500'
                }}>
                  Avg Order Value
                </div>
              </div>
            </div>

            {/* Revenue by Day Table */}
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-md)',
                margin: 0
              }}>
                Revenue by Day
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  borderCollapse: 'separate',
                  borderSpacing: 0
                }}>
                  <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <tr>
                      <th style={{
                        padding: 'var(--spacing-md)',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid var(--border-color)'
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: 'var(--spacing-md)',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid var(--border-color)'
                      }}>
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.revenueByDay.map((day: any, index: number) => (
                      <tr key={index} style={{
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                        <td style={{
                          padding: 'var(--spacing-md)',
                          fontSize: '0.875rem',
                          color: 'var(--text-primary)',
                          borderBottom: index < analytics.revenueByDay.length - 1 ? '1px solid var(--border-light)' : 'none'
                        }}>
                          {day.date}
                        </td>
                        <td style={{
                          padding: 'var(--spacing-md)',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          borderBottom: index < analytics.revenueByDay.length - 1 ? '1px solid var(--border-light)' : 'none'
                        }}>
                          {formatPrice(day.revenueCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: 'var(--spacing-2xl)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-lg)',
            alignItems: 'end'
          }}>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: 'var(--spacing-md)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                width: '20px',
                height: '20px',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-md) 3rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-blue)';
                  e.target.style.boxShadow = '0 0 0 3px var(--primary-blue-light)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-blue)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-blue-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-blue)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-blue-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>

            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-tertiary)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: '500'
            }}>
              Showing {getCurrentPageProducts().length} of {filteredProducts.length} products
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          <ProductTable
            products={getCurrentPageProducts()}
            onEdit={handleEditProduct}
            onToggleActive={handleToggleActive}
            onRemove={handleRemoveProduct}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            marginTop: 'var(--spacing-2xl)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <nav style={{
              display: 'flex',
              gap: 'var(--spacing-sm)'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: '0.875rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }
                }}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    fontSize: '0.875rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: currentPage === page ? 'var(--primary-blue)' : 'var(--bg-primary)',
                    color: currentPage === page ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                    }
                  }}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: '0.875rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }
                }}
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Modals */}
        {showProductForm && (
          <ProductForm
            initialProduct={editingProduct}
            onSubmit={handleSubmitProduct}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(undefined);
            }}
          />
        )}

        {showConfirmDialog && (
          <ConfirmDialog
            title="Remove Product"
            message="Are you sure you want to remove this product? This action cannot be undone."
            onConfirm={confirmRemove}
            onCancel={() => {
              setShowConfirmDialog(false);
              setProductToRemove('');
            }}
          />
        )}
      </div>
    </div>
  );
};
