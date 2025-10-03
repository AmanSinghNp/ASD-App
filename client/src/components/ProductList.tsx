// client/src/components/ProductList.tsx

import React, { useState } from 'react';
import { useProductCatalogue } from '../hooks/useProductCatalogue';
import ProductCard from './ProductCard';
<<<<<<< HEAD
import type { Product } from '../models/ProductCatalogueModel';
=======
import { useCartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
>>>>>>> origin/dev

/**
 * ProductList component for displaying and filtering products
 * Provides search, category filtering, and sorting functionality
 */
const ProductList: React.FC = () => {
  const {
<<<<<<< HEAD
    products, // This is the final list to render.
    categories,
    suggestions,
    setSuggestions,
    inputValue,
    generateSuggestions,
    setAppliedCategory,
    setAppliedSort,
    appliedQuery,
    setAppliedQuery,
=======
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
>>>>>>> origin/dev
  } = useProductCatalogue();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  // Temporary local state ONLY for the dropdowns, not the search input.
  const [tempCategory, setTempCategory] = useState('all');
  const [tempSort, setTempSort] = useState({ by: 'name', ascending: true });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generateSuggestions(e.target.value);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    generateSuggestions(suggestionText); // Update input and suggestions
    setAppliedQuery(suggestionText);    // Immediately apply the search
    setSuggestions([]);                 // Hide suggestions, small change for git push 
  };

  const handleApplyFilters = () => {
    setAppliedCategory(tempCategory);
    setAppliedSort(tempSort);
    setAppliedQuery(inputValue); // Apply the current text from the input box
    setSuggestions([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '2rem' }}>Product Catalogue</h2>
      
<<<<<<< HEAD
      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={inputValue} 
            onChange={handleSearchChange}
            autoComplete="off"
            className="filter-input"
=======
      {/* Filters Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        {/* Category Filter */}
        <div>
          <label htmlFor="category" style={{ marginRight: "8px" }}>
            Category:{" "}
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
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
            value={`${sortOption.by}-${sortOption.ascending ? "asc" : "desc"}`}
            onChange={(e) => {
              const [by, direction] = e.target.value.split("-");
              setSortOption({ by, ascending: direction === "asc" });
            }}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
        
        {/* Search Input Field */}
        <div>
          <label htmlFor="search" style={{ marginRight: "8px" }}>
            Search:{" "}
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
>>>>>>> origin/dev
          />
          {suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  className="suggestion-item"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select 
          id="category"
          value={tempCategory} 
          onChange={(e) => setTempCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        <select 
          id="sort"
          value={`${tempSort.by}-${tempSort.ascending ? 'asc' : 'desc'}`}
          onChange={(e) => {
            const [by, direction] = e.target.value.split('-');
            setTempSort({ by, ascending: direction === 'asc' });
          }}
          className="filter-select"
        >
          <option value="name-asc">Sort: Name (A-Z)</option>
          <option value="name-desc">Sort: Name (Z-A)</option>
          <option value="brand-asc">Sort: Brand (A-Z)</option>
          <option value="brand-desc">Sort: Brand (Z-A)</option>
          <option value="price-asc">Sort: Price (Low to High)</option>
          <option value="price-desc">Sort: Price (High to Low)</option>
          <option value="rating-desc">Sort: Rating (High to Low)</option>
        </select>
        
        <button onClick={handleApplyFilters} className="apply-filters-btn">
          Apply Filters
        </button>
      </div>
<<<<<<< HEAD
      
      <p style={{ margin: '20px 0 15px 0', color: '#666' }}>
  {products.length === 0 && appliedQuery ? (
    `Please Enter valid letter !!!`
  ) : (
    `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`
  )}
</p>
      
=======
      {/* Results Count */}
      <p style={{ marginBottom: "15px", color: "#666" }}>
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
        {selectedCategory !== "all" &&
          ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
      {/* Products Grid */}
>>>>>>> origin/dev
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px'
      }}>
<<<<<<< HEAD
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
=======
        {products.length > 0 ? (
          products.map(product => (
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
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
>>>>>>> origin/dev
      </div>
    </div>
  );
};

export default ProductList;
