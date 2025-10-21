import React from 'react';
import { useCartContext } from '../context/CartContext';
import { useProductCatalogue } from '../hooks/useProductCatalogue';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
  } = useProductCatalogue();
  const { addToCart } = useCartContext();

  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)', fontSize: '1.5rem', fontWeight: 600 }}>
        Product Catalogue
      </h2>

      {/* Filters Section */}
      <div
        className="filters"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
          alignItems: 'center',
        }}
      >
        {/* Category Filter */}
        <div>
          <label htmlFor="category" style={{ marginRight: '8px' }}>
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" style={{ marginRight: '8px' }}>
            Sort by:
          </label>
          <select
            id="sort"
            value={`${sortOption.by}-${sortOption.ascending ? 'asc' : 'desc'}`}
            onChange={(e) => {
              const [by, direction] = e.target.value.split('-');
              setSortOption({ by, ascending: direction === 'asc' });
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label htmlFor="search" style={{ marginRight: '8px' }}>
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
        </div>
      </div>

      {/* Results Count */}
      <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && ` in ${categories.find((c) => c.id === selectedCategory)?.name ?? ''}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
