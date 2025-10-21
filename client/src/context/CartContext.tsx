import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartController } from '../controllers/CartController';
import type { CartItem } from '../models/CartModel';

// Singleton CartController instance
let globalCartController: CartController | null = null;
function getCartController() {
  if (!globalCartController) globalCartController = new CartController();
  return globalCartController;
}

const CartContext = createContext<any>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartUpdated, setCartUpdated] = useState(0);
  const controller = useMemo(() => getCartController(), []);

  const refreshCart = () => {
    setCartItems(controller.getCartItems());
    setCartUpdated(prev => prev + 1);
  };

  const addToCart = (product: any, quantity: number = 1) => {
    const success = controller.addToCart(product, quantity);
    if (success) refreshCart();
    return success;
  };
  const removeFromCart = (productId: string) => {
    const success = controller.removeFromCart(productId);
    if (success) refreshCart();
    return success;
  };
  const updateQuantity = (productId: string, quantity: number) => {
    const success = controller.updateQuantity(productId, quantity);
    if (success) refreshCart();
    return success;
  };
  const clearCart = () => {
    const success = controller.clearCart();
    if (success) refreshCart();
    return success;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalPrice: controller.getTotalPrice(),
      totalItems: controller.getTotalItems(),
      isEmpty: controller.isEmpty(),
      cartUpdated
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);