import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Product, ProductFormData } from '../../types/product';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {analytics && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics (Last 7 Days)</h2>
            
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(analytics.kpis.revenueTotalCents)}</div>
                <div className="text-sm text-blue-800">Total Revenue</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.kpis.ordersCount}</div>
                <div className="text-sm text-green-800">Total Orders</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatPrice(analytics.kpis.avgOrderValueCents)}</div>
                <div className="text-sm text-purple-800">Avg Order Value</div>
              </div>
            </div>

            {/* Revenue by Day Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Day</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.revenueByDay.map((day: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{day.date}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(day.revenueCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center justify-center bg-gray-50 px-4 py-3 rounded-lg">
              Showing {getCurrentPageProducts().length} of {filteredProducts.length} products
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ProductTable
            products={getCurrentPageProducts()}
            onEdit={handleEditProduct}
            onToggleActive={handleToggleActive}
            onRemove={handleRemoveProduct}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
