import React from 'react';
import { useCart } from './hooks/useCart';
import { type CartItem as CartItemType } from './models/CartModel';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart: React.FC = () => {

  const { 
    cartItems, 
    totalPrice, 
    totalItems, 
    isEmpty, 
    removeFromCart, 
    updateQuantity,
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  if (isEmpty) {
    return (
      <div className="cart-container">
        {/* <h2 className="cart-title">Your Cart</h2> */}
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p className="empty-cart-subtitle">Add some products to get started!</p>
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
      </div>
    );
  }

  function handleRemoveItem(productId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Your Cart</h2>
        <div className="cart-summary">
          <span className="item-count">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={clearCart}
            className="clear-cart-btn"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cartItems.map((item) => (
          <CartItem 
            key={item.productId}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-footer">
        <div className="total-section">
          <span className="total-label">Total:</span>
          <span className="total-price">${totalPrice.toFixed(2)}</span>
        </div>
        
        <button className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

// Cart Item Component
interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="cart-item">
      <img 
        src={item.product.imageUrl} 
        alt={item.product.name}
        className="cart-item-image"
      />
      
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-description">{item.product.description}</p>
        <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
      </div>

      <div className="quantity-controls">
        <button 
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          className="quantity-btn"
        >
          -
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button 
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
          className="quantity-btn"
        >
          +
        </button>
      </div>

      <div className="item-total">
        <div className="item-total-price">
          ${(item.product.price * item.quantity).toFixed(2)}
        </div>
        <div className="item-quantity-breakdown">
          {item.quantity} × ${item.product.price.toFixed(2)}
        </div>
      </div>

      <button 
        onClick={() => onRemove(item.productId)}
        className="remove-item-btn"
      >
        Remove
      </button>
    </div>
  );
};

export default Cart;