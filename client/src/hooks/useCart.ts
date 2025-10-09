import { useState, useMemo } from 'react';
import { CartController } from '../controllers/CartController';
import type { CartItem } from '../models/CartModel';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartUpdated, setCartUpdated] = useState(0);

  const controller = useMemo(() => new CartController(), []);

  // Refresh cart items
  const refreshCart = () => {
    setCartItems(controller.getCartItems());
    setCartUpdated(prev => prev + 1);
  };

  // Add to cart
  const addToCart = (product: any, quantity: number = 1) => {
    const success = controller.addToCart(product, quantity);
    if (success) {
      refreshCart();
    }
    return success;
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    const success = controller.removeFromCart(productId);
    if (success) {
      refreshCart();
    }
    return success;
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    const success = controller.updateQuantity(productId, quantity);
    if (success) {
      refreshCart();
    }
    return success;
  };

  // Clear cart
  const clearCart = () => {
    const success = controller.clearCart();
    if (success) {
      refreshCart();
    }
    return success;
  };

  return {
    cartItems,
    totalPrice: controller.getTotalPrice(),
    totalItems: controller.getTotalItems(),
    isEmpty: controller.isEmpty(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart: controller.isInCart.bind(controller),
    getItemQuantity: controller.getItemQuantity.bind(controller),
    cartUpdated
  };
};