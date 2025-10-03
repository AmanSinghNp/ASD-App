import React from 'react';
import { useCartContext } from '../context/CartContext';
import { useProductCatalogue } from '../hooks/useProductCatalogue';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

const ProductList: React.FC = () => {
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
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333', marginBottom: 0 }}>Product Catalogue</h2>
        <button
          onClick={() => navigate('/cart')}
          style={{
            padding: '10px 18px',
            backgroundColor: '#493aecff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Go to Cart
        </button>
      </div>
      

      
      {/* Filters Section */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '15px', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        {/* Category Filter */}
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
        {/* Sort Filter */}
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
          </select>
        </div>
        {/* Search Filter */}
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

      {/* Results Count */}
      <p style={{ marginBottom: '15px', color: '#666' }}>
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          justifyItems: 'start',
        }}
      >
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))
        ) : (
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