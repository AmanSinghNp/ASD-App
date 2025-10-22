import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductController } from '../controllers/ProductCatalogueController';
import { useCartContext } from '../context/CartContext';
import type { Product } from '../models/ProductCatalogueModel';

// ProductDetail component displays detailed info for a single product.
// Consider extracting shared UI (e.g., QuantityInput, FeedbackMessage) for reuse in ProductCard, Cart, etc.
const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  // For reusability: extract quantity state/logic to a custom hook if used in multiple places.

  useEffect(() => {
    // Controller pattern: reuses business logic for fetching product details.
    // Good for reusability and separation of concerns.
    const controller = new ProductController();
    if (productId) {
      const productDetails = controller.getProductDetails(productId);
      setProduct(productDetails || null);
    }
    setLoading(false);
  }, [productId]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!product) {
    // Reusable: This 'not found' block could be a shared component (e.g., <NotFound />)
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 15px',
            backgroundColor: '#493aecff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  // const addToCart = () => {
  //   // Add your cart logic here
  // };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: 'white',
        border: '1.5px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(73, 58, 236, 0.08)',
        padding: '40px 32px',
        maxWidth: '700px',
        width: '100%',
        margin: '32px 0',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            alignSelf: 'flex-start',
            padding: '8px 12px',
            backgroundColor: '#493aecff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
            color: 'white',
            fontWeight: 600
          }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', width: '100%', gap: '32px', alignItems: 'flex-start', marginBottom: 24 }}>
          {/* Consider extracting ProductImage as a reusable component if used elsewhere */}
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ 
              width: '220px',
              height: '220px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
              border: '1px solid #eee',
              background: '#fafaff',
              flexShrink: 0
            }} 
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ color: '#000000', marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ 
              fontSize: '1.5em', 
              fontWeight: 'bold', 
              color: '#493aecff', 
              margin: '10px 0 8px 0'
            }}>
              ${(product.priceCents / 100).toFixed(2)}
            </p>
            <p style={{ 
              color: product.stockQty > 0 ? 'black' : 'red',
              fontSize: '1.1em',
              margin: '0 0 12px 0'
            }}>
              {product.stockQty > 0 ? `In stock: ${product.stockQty} units available` : 'Out of stock'}
            </p>
          </div>
        </div>
        <div style={{ margin: '18px 0', width: '100%' }}>
          <h3 style={{ marginBottom: '8px', color: '#000000', paddingLeft: '24px' }}>Description</h3>
          <p style={{ color: '#444', fontSize: '1.08em', margin: 0, paddingLeft: '24px' }}>{product.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, position: 'relative' }}>
          <label style={{ fontWeight: 500 }} htmlFor={`qty-input-detail-${product.id}`}>Qty:</label>
          {/* Reusable: Extract this input as <QuantityInput /> for use in catalogue, cart, etc. */}
          <input
            id={`qty-input-detail-${product.id}`}
            type="number"
            min={1}
            max={product.stockQty}
            value={quantity}
            style={{ width: 50, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
            disabled={product.stockQty === 0}
            onChange={e => setQuantity(Math.max(1, Math.min(product.stockQty, Number(e.target.value))))}
          />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Reusable: Extract this button as <AddToCartButton /> if logic is shared with catalogue or other views */}
            <button 
              disabled={product.stockQty === 0}
              style={{
                padding: '12px 32px',
                backgroundColor: product.stockQty > 0 ? '#493aecff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: product.stockQty > 0 ? 'pointer' : 'not-allowed',
                fontSize: '1.1em',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(73,58,236,0.08)',
                transition: 'background 0.2s',
                position: 'relative',
                zIndex: 1
              }}
              onClick={() => {
                addToCart(product, quantity);
                setAddedMsg(true);
                setTimeout(() => setAddedMsg(false), 1200);
              }}
            >
              {product.stockQty > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {/* Reusable: Extract this feedback as <FeedbackMessage /> for use in other components */}
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
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#28a745"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Added!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;