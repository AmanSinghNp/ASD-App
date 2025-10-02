import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../models/ProductCatalogueModel';

/**
 * Props interface for ProductCard component
 */
interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component for displaying individual product information
 * Shows product details and handles navigation to product detail page
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  /**
   * Handle card click to navigate to product detail page
   */
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="product-card" 
      onClick={handleClick} 
      style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '16px', 
        margin: '10px', 
        cursor: 'pointer',
        maxWidth: '300px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Product Image */}
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        style={{ 
          width: '100%', 
          height: '200px', 
          objectFit: 'cover', 
          borderRadius: '4px' 
        }} 
      />
      
      {/* Product Name */}
      <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
      
      {/* Product Price */}
      <p style={{ 
        fontWeight: 'bold', 
        color: '#493aecff', 
        fontSize: '1.2em', 
        margin: '8px 0' 
      }}>
        ${product.price.toFixed(2)}
      </p>
      
      {/* Product Description */}
      <p style={{ 
        color: '#666', 
        margin: '8px 0',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {product.description}
      </p>
      
      {/* Stock Status */}
      <p style={{ 
        color: product.stock > 0 ? 'black' : 'red',
        margin: '8px 0'
      }}>
        {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
      </p>
      
      {/* Product Rating (if available) */}
      {product.rating && (
        <p style={{ margin: '8px 0' }}>
          Rating: {product.rating}/5 
          <span style={{ color: '#ffc107', marginLeft: '5px' }}>
            {'★'.repeat(Math.round(product.rating))}
          </span>
        </p>
      )}

      {/* Add to Cart Button */}
      <button 
        disabled={product.stock === 0}
        style={{
          padding: '12px 24px',
          backgroundColor: product.stock > 0 ? '#493aecff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
          fontSize: '1.1em'
        }}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;