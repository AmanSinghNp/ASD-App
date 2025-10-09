import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Product } from '../models/ProductCatalogueModel';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [_, forceUpdate] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="product-card" 
      style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '16px', 
        margin: '10px', 
        cursor: 'pointer',
        maxWidth: '300px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
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
      <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
      <p style={{ 
        fontWeight: 'bold', 
        color: '#493aecff', 
        fontSize: '1.2em', 
        margin: '8px 0' 
      }}>
        ${ (product.priceCents / 100).toFixed(2) }
      </p>
  {/* Description removed: not present in new Product type */}
      <p style={{ 
        color: product.stockQty > 0 ? 'black' : 'red',
        margin: '8px 0'
      }}>
        {product.stockQty > 0 ? `In stock: ${product.stockQty}` : 'Out of stock'}
      </p>

  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
    <label style={{ fontWeight: 500 }} htmlFor={`qty-input-${product.id}`}>Qty:</label>
    <input
      id={`qty-input-${product.id}`}
      type="number"
      min={1}
      max={product.stockQty}
      value={quantity}
      onClick={e => e.stopPropagation()}
      onChange={e => setQuantity(Math.max(1, Math.min(product.stockQty, Number(e.target.value))))}
      style={{ width: 50, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
      disabled={product.stockQty === 0}
    />
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        disabled={product.stockQty === 0}
        style={{
          padding: '12px 24px',
          backgroundColor: product.stockQty > 0 ? '#493aecff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: product.stockQty > 0 ? 'pointer' : 'not-allowed',
          fontSize: '1.1em',
          position: 'relative',
          zIndex: 1
        }}
        aria-label={product.stockQty > 0 ? 'Add to Cart' : 'Out of Stock'}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product, quantity);
          setAddedMsg(true);
          forceUpdate(x => x + 1); // force re-render to update stockQty
          setTimeout(() => setAddedMsg(false), 1200);
        }}
      >
        {product.stockQty > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
      {addedMsg && (
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '-38px',
            transform: 'translateX(-50%)',
            background: '#28a745',
            color: 'white',
            padding: '7px 18px 7px 14px',
            borderRadius: '20px',
            fontWeight: 600,
            fontSize: '1em',
            boxShadow: '0 2px 8px rgba(40,167,69,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: addedMsg ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)',
            pointerEvents: 'none',
            zIndex: 2
          }}
          role="status"
          aria-live="polite"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 4}}>
            <circle cx="10" cy="10" r="10" fill="#fff" fillOpacity="0.18"/>
            <path d="M6 10.5l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Added to cart!
        </span>
      )}
    </div>
  </div>
  </div>
  );
};

export default ProductCard;