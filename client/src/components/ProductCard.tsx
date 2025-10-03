import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../models/ProductCatalogueModel";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
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
<<<<<<< HEAD
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '10px',
        cursor: 'pointer',
        maxWidth: '300px',
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack items vertically
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
=======
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "10px",
        cursor: "pointer",
        maxWidth: "300px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
>>>>>>> origin/dev
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
<<<<<<< HEAD
      <div style={{ marginBottom: '12px', textAlign: 'left' }}>
        <span style={{
          backgroundColor: '#eef2ff',
          color: '#4338ca',
          padding: '4px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
        }}>
          {product.brand}
        </span>
      </div>

      <img
        src={product.imageUrl}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder-product.jpg";
          e.currentTarget.alt = "";
        }}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
      />

      <h3 style={{ margin: '10px 0', flexGrow: 1 }}>{product.name}</h3> {/* flexGrow makes sure the button aligns to the bottom */}

      <p style={{
        fontWeight: 'bold',
        color: '#493aecff',
        fontSize: '1.2em',
        margin: '8px 0'
      }}>
        ${product.price.toFixed(2)}
      </p>

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

      <p style={{
        color: product.stock > 0 ? 'black' : 'red',
        margin: '8px 0'
      }}>
        {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
      </p>

      {product.rating && (
        <p style={{ margin: '8px 0' }}>
          Rating: {product.rating}/5
          <span style={{ color: '#ffc107', marginLeft: '5px' }}>
            {'★'.repeat(Math.round(product.rating))}
=======
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
      <p
        style={{
          fontWeight: "bold",
          color: "#493aecff",
          fontSize: "1.2em",
          margin: "8px 0",
        }}
      >
        ${product.price.toFixed(2)}
      </p>
      <p
        style={{
          color: "#666",
          margin: "8px 0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.description}
      </p>
      <p
        style={{
          color: product.stock > 0 ? "black" : "red",
          margin: "8px 0",
        }}
      >
        {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
      </p>
      
      {/* Product Rating (if available) */}
      {product.rating && (
        <p style={{ margin: "8px 0" }}>
          Rating: {product.rating}/5
          <span style={{ color: "#ffc107", marginLeft: "5px" }}>
            {"★".repeat(Math.round(product.rating))}
>>>>>>> origin/dev
          </span>
        </p>
      )}

      <button
        disabled={product.stock === 0}
        style={{
<<<<<<< HEAD
          padding: '12px 24px',
          backgroundColor: product.stock > 0 ? '#493aecff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
          fontSize: '1.1em',
          marginTop: 'auto' // Pushes button to the bottom
        }}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
=======
          padding: "12px 24px",
          backgroundColor: product.stock > 0 ? "#493aecff" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: product.stock > 0 ? "pointer" : "not-allowed",
          fontSize: "1.1em",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (product.stock > 0) {
            onAddToCart(product, quantity);
            setAddedMsg(true);
            setTimeout(() => setAddedMsg(false), 1200);
          }
        }}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
      {addedMsg && (
        <div style={{ marginTop: 8, color: "#166534", fontSize: 12 }}>Added!</div>
      )}
>>>>>>> origin/dev
    </div>
  );
};

export default ProductCard;
