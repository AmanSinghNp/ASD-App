// client/src/components/ProductList.tsx

import React from 'react';
import { useProductCatalogue } from '../hooks/useProductCatalogue';
import ProductCard from './ProductCard';
import { useCartContext } from '../context/CartContext';
import type { Product } from '../models/ProductCatalogueModel';

/**
 * ProductList component for displaying and filtering products.
 * Provides live search with suggestions, category filtering, and sorting functionality.
 */
const ProductList: React.FC = () => {
  // Use the refined hook that separates input value from the applied query for performance.
  const {
    products,
    categories,
    suggestions,
    setSuggestions,
    inputValue,
    generateSuggestions,
    setAppliedCategory,
    setAppliedSort,
    setAppliedQuery,
  } = useProductCatalogue();
  
  const { addToCart } = useCartContext();

  // Handle live typing in the search input to show suggestions.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generateSuggestions(e.target.value);
  };
  
  // Handle form submission (e.g., pressing Enter) to apply the search query.
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedQuery(inputValue);
    setSuggestions([]); // Hide suggestions after search is applied
  };

  // Handle clicking on a suggestion.
  const handleSuggestionClick = (suggestionText: string) => {
    generateSuggestions(suggestionText); // Update input field text
    setAppliedQuery(suggestionText);     // Immediately apply the search
    setSuggestions([]);                  // Hide suggestions
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)', fontSize: '1.5rem', fontWeight: 600 }}>Product Catalogue</h2>
      
      {/* Filters Section */}
      <div
        className="filters"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-lg)",
          alignItems: "center",
        }}
      >
        {/* Search Form and Input */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <label htmlFor="search" style={{ marginRight: "8px" }}>
            Search:{" "}
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search products and press Enter..."
            value={inputValue}
            onChange={handleSearchChange}
            autoComplete="off"
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
          />
          {suggestions.length > 0 && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              backgroundColor: 'white', border: '1px solid #ddd',
              listStyle: 'none', margin: '5px 0 0', padding: 0, zIndex: 10
            }}>
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  style={{ padding: '10px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" style={{ marginRight: "8px" }}>
            Category:{" "}
          </label>
          <select
            id="category"
            // The value is controlled by a local state, but the filter is applied via setAppliedCategory
            onChange={(e) => setAppliedCategory(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort Options Dropdown */}
        <div>
          <label htmlFor="sort" style={{ marginRight: "8px" }}>
            Sort by:{" "}
          </label>
          <select
            id="sort"
            onChange={(e) => {
              const [by, direction] = e.target.value.split("-");
              setAppliedSort({ by, ascending: direction === "asc" });
            }}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating-desc">Rating (High to Low)</option>
          </select>
        </div>
      </div>
      
      {/* Results Count */}
      <p style={{ marginBottom: "var(--spacing-md)", color: "var(--text-secondary)" }}>
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      {/* Products Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 'var(--spacing-lg)'
      }}>
        {products.length > 0 ? (
          products.map((product: Product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
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
