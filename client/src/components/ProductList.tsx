import React from 'react';
import { useProductCatalogue } from '../hooks/useProductCatalogue';
import ProductCard from './ProductCard';

/**
 * ProductList component for displaying and filtering products
 * Provides search, category filtering, and sorting functionality
 */
const ProductList: React.FC = () => {
  // Get product data and filter controls from custom hook
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery
  } = useProductCatalogue();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Product Catalogue</h2>
      
      {/* Filter Controls Section */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '15px', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        {/* Category Filter Dropdown */}
        <div>
          <label htmlFor="category" style={{ marginRight: '8px' }}>Category: </label>
          <select 
            id="category"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort Options Dropdown */}
        <div>
          <label htmlFor="sort" style={{ marginRight: '8px' }}>Sort by: </label>
          <select 
            id="sort"
            value={`${sortOption.by}-${sortOption.ascending ? 'asc' : 'desc'}`}
            onChange={(e) => {
              const [by, direction] = e.target.value.split('-');
              setSortOption({ by, ascending: direction === 'asc' });
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating-desc">Rating (High to Low)</option>
          </select>
        </div>
        
        {/* Search Input Field */}
        <div>
          <label htmlFor="search" style={{ marginRight: '8px' }}>Search: </label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
      </div>
      
      {/* Results Summary */}
      <p style={{ marginBottom: '15px', color: '#666' }}>
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
      
      {/* Products Grid Display */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px'
      }}>
        {products.length > 0 ? (
          // Render product cards for each filtered product
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Empty state when no products match filters
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px',
          }}>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;