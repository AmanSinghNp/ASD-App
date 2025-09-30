// import React from 'react';
// import { useProductCatalogue } from '../hooks/useProductCatalogue';
// import ProductCard from './ProductCard';

// const ProductList: React.FC = () => {
//   const { 
//     products, 
//     categories, 
//     selectedCategory, 
//     setSelectedCategory,
//     sortOption,
//     setSortOption,
//     searchQuery,
//     setSearchQuery
//   } = useProductCatalogue();

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2 style={{ color: '#333', marginBottom: '20px' }}>Product Catalogue</h2>
      
//      {/* Filters Section */}
//       <div className="filter-bar" style={{ marginBottom: '20px' }}>
//         {/* Category Filter */}
//         <select 
//           id="category"
//           value={selectedCategory} 
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="filter-select"
//         >
//           <option value="all">All Categories</option>
//           {categories.map(category => (
//             <option key={category.id} value={category.id}>
//               {category.name}
//             </option>
//           ))}
//         </select>
        
//         {/* Sort Filter */}
//         <select 
//           id="sort"
//           value={`${sortOption.by}-${sortOption.ascending ? 'asc' : 'desc'}`}
//           onChange={(e) => {
//             const [by, direction] = e.target.value.split('-');
//             setSortOption({ by, ascending: direction === 'asc' });
//           }}
//           className="filter-select"
//         >
//           <option value="name-asc">Sort: Name (A-Z)</option>
//           <option value="name-desc">Sort: Name (Z-A)</option>
//           <option value="price-asc">Sort: Price (Low to High)</option>
//           <option value="price-desc">Sort: Price (High to Low)</option>
//           <option value="rating-desc">Sort: Rating (High to Low)</option>
//         </select>
        
//         {/* Search Filter */}
//         <input
//           id="search"
//           type="text"
//           placeholder="Search by name or brand"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="filter-input"
//         />
//       </div>
      
//       {/* Results Count */}
//       <p style={{ marginBottom: '15px', color: '#666' }}>
//         Showing {products.length} product{products.length !== 1 ? 's' : ''}
//         {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
//         {searchQuery && ` matching "${searchQuery}"`}
//       </p>
      
//       {/* Products Grid */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
//         gap: '20px'
//       }}>
//         {products.length > 0 ? (
//           products.map(product => (
//             <ProductCard key={product.id} product={product} />
//           ))
//         ) : (
//           <div style={{ 
//             gridColumn: '1 / -1', 
//             textAlign: 'center', 
//             padding: '40px',
//           }}>
//             <h3>No products found</h3>
//             <p>Try adjusting your filters or search term</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductList;



// client/src/components/ProductList.tsx

import React from 'react';
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
    setSearchQuery
  } = useProductCatalogue();

  return (
    <div style={{ padding: '20px', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '2rem' }}>Product Catalogue</h2>
      
      {/* Filters Section */}
      <div className="filter-bar">
        {/* Search Filter */}
        <input
          id="search"
          type="text"
          placeholder="Search by name or brand"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />

        {/* Category Filter */}
        <select 
          id="category"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        {/* Sort Filter */}
        <select 
          id="sort"
          value={`${sortOption.by}-${sortOption.ascending ? 'asc' : 'desc'}`}
          onChange={(e) => {
            const [by, direction] = e.target.value.split('-');
            setSortOption({ by, ascending: direction === 'asc' });
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
        
        {/* Apply Filters Button */}
        <button className="apply-filters-btn">
          Apply Filters
        </button>
      </div>
      
      {/* Results Count */}
      <p style={{ margin: '20px 0 15px 0', color: '#666' }}>
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
      
      {/* Products Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px'
      }}>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
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