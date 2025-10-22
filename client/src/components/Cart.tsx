
import React from 'react';
import { useCartContext } from '../context/CartContext';
import { type CartItem as CartItemType } from '../models/CartModel';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    totalPrice, 
    totalItems, 
    isEmpty, 
  removeFromCart, 
  clearCart 
  } = useCartContext();


  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  if (isEmpty) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        color: '#666'
      }}>
        {/* <h2 style={{ color: '#333', marginBottom: '10px' }}>Your Cart</h2> */}
        <p>Your cart is empty</p>
        <p style={{ fontSize: '14px', color: '#888' }}>Add some products to get started!</p>
        <button
          style={{
            marginTop: 20,
            padding: '12px 28px',
            backgroundColor: '#493aecff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: '1.1em',
            cursor: 'pointer',
            fontWeight: 500
          }}
          onClick={() => navigate('/')}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      backgroundColor: '#f8f8f8',
    }}>
      <main style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <div style={{
          padding: '16px',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '900px',
          width: '100%',
          margin: '32px auto',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(73, 58, 236, 0.08)',
          border: '1px solid #ddd',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '10px',
          }}>
            <h2 style={{ color: 'black', margin: 0, fontWeight: 700, fontSize: '1.7em', letterSpacing: 0.5 }}>Your Cart</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
              <span style={{ color: '#493aecff', fontWeight: 600, fontSize: '1em' }}>
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearCart}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  boxShadow: '0 2px 8px rgba(255,107,107,0.08)'
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>



          {/* Cart Items */}
          <div style={{ marginBottom: '36px' }}>
            {cartItems.map((item: CartItemType) => (
              <CartItem
                key={item.productId}
                item={item}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Cart Summary and Actions */}
          <div style={{
            borderTop: '1px solid #ddd',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '18px',
          }}>
            <div style={{
              fontSize: '1.3em',
              fontWeight: 700,
              color: 'black',
              marginBottom: 8,
              letterSpacing: 0.5,
            }}>
              Total: <span style={{ color: '#493aecff' }}>${cartItems.reduce((sum: number, item: { product: { priceCents: number; }; quantity: number; }) => sum + (item.product.priceCents * item.quantity) / 100, 0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#493aecff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1em',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(73,58,236,0.08)',
                  transition: 'background 0.2s',
                }}
                onClick={() => navigate('/checkout')}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2c5aa0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#493aecff'}
              >
                Proceed to Checkout
              </button>
              <button
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'white',
                  color: '#493aecff',
                  border: '2px solid #493aecff',
                  borderRadius: '8px',
                  fontSize: '1.1em',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(73,58,236,0.04)',
                  transition: 'background 0.2s',
                }}
                onClick={() => navigate('/')}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f1ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                Back to Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Cart Item Component
interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '14px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(73, 58, 236, 0.04)'
    }}>
      {/* Product Image */}
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginRight: '18px',
          border: '1.5px solid #493aecff',
        }}
      />

      {/* Product Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 6px 0', color: 'black', fontWeight: 700, fontSize: '1.15em' }}>
          {item.product.name}
        </h3>
        <p style={{
          margin: '0 0 8px 0',
          color: 'black',
          fontSize: '14px',
        }}>
          {item.product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#493aecff', fontWeight: 600, fontSize: '1.1em' }}>
            ${ (item.product.priceCents / 100).toFixed(2) }
          </span>
          <span style={{ color: 'black', fontSize: '1em' }}>
            × {item.quantity}
          </span>
          <span style={{ color: '#28a745', fontWeight: 600, fontSize: '1.1em' }}>
            = ${ ((item.product.priceCents * item.quantity) / 100).toFixed(2) }
          </span>
        </div>
      </div>

      {/* Quantity Display Only */}
  {/* Removed big quantity display */}

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.productId)}
        style={{
          padding: '5px 10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          marginLeft: 10,
        }}
      >
        Remove
      </button>
    </div>
  );
};

export default Cart;