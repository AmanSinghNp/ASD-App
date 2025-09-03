import React from 'react';
import "./Filter.css"; // Importing the CSS file

// --- Mock Data ---
// In a real application, you would fetch this data from an API.
const categories: string[] = [
  'All Categories',
  'Electronics & Digital',
  'Apparel, Shoes & Bags',
  'Home & Kitchen Appliances',
  'Beauty & Personal Care',
  'Books, Media & Games',
  'Automotive Parts & Accessories ',
  'Grocery & Fresh Food ',
  'Pet Supplies',
  'Sports & Outdoors',
  'Lighting',

  
];

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'name_asc', label: 'Sort: Name (A-Z)' },
  { value: 'company_asc', label: 'Sort: Company (A-Z)' },
  { value: 'price_asc', label: 'Sort: Price (Low → High)' },
  { value: 'price_desc', label: 'Sort: Price (High → Low)' },
  { value: 'stock_desc', label: 'Sort: Stock (High → Low)' },
];


// --- The Component ---
const FilterComponent = () => {
  return (
    <div className="iotbay-filter-container">
      {/* Main Title */}
      <h1>Supermarekt</h1>
      <p>Welcome to ASD Supermarekt </p>

      <div className="filter-bar">
        {/* 1. Search Bar */}
        <input
          type="text"
          placeholder="Search by name or brand"
          className="filter-input"
        />

        {/* 2. Categories Dropdown */}
        <select className="filter-select">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* 3. Sort Dropdown */}
        <select className="filter-select">
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 4. Apply Button */}
        <button className="apply-filters-btn">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;