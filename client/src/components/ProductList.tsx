// client/src/components/ProductList.tsx

import React, { useState } from 'react';
import { useProductCatalogue } from '../hooks/useProductCatalogue';
import ProductCard from './ProductCard';
import type { Product } from '../models/ProductCatalogueModel';

const ProductList: React.FC = () => {
  const {
    products, // This is the final list to render.
    categories,
    suggestions,
    setSuggestions,
    inputValue,
    generateSuggestions,
    setAppliedCategory,
    setAppliedSort,
    setAppliedQuery,
  } = useProductCatalogue();

  // Temporary local state ONLY for the dropdowns, not the search input.
  const [tempCategory, setTempCategory] = useState('all');
  const [tempSort, setTempSort] = useState({ by: 'name', ascending: true });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generateSuggestions(e.target.value);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    generateSuggestions(suggestionText); // Update input and suggestions
    setAppliedQuery(suggestionText);    // Immediately apply the search
    setSuggestions([]);                 // Hide suggestions
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
      
      <p style={{ margin: '20px 0 15px 0', color: '#666' }}>
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px'
      }}>
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;