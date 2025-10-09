import React, { createContext, useContext, useMemo, useState } from "react";
import { CartController } from "../controllers/CartController";
import type { CartItem } from "../models/CartModel";

// Keep singleton controller as you had it
let globalCartController: CartController | null = null;
function getCartController() {
  if (!globalCartController) globalCartController = new CartController();
  return globalCartController;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => boolean;
  removeFromCart: (productId: string) => boolean;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => boolean;
  /** totalPrice is expressed in dollars (e.g. 12.34) */
  totalPrice: number;
  totalItems: number;
  isEmpty: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const controller = useMemo(() => getCartController(), []);

  const refreshCart = () => setCartItems(controller.getCartItems());

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

  // Helper: get price in cents from product object (defensive)
  const getPriceCents = (product: any): number => {
    if (!product) return 0;
    // If product.priceCents exists and is numeric -> use it
    if (
      typeof product.priceCents !== "undefined" &&
      product.priceCents !== null
    ) {
      const n = Number(product.priceCents);
      if (!Number.isNaN(n)) return Math.round(n);
    }
    // Fallback: product.price (assume dollars) -> convert to cents
    if (typeof product.price !== "undefined" && product.price !== null) {
      const n = Number(product.price);
      if (!Number.isNaN(n)) return Math.round(n * 100);
    }
    return 0;
  };

  // Sum using integer cents to avoid floating point rounding issues
  const totalPriceCents = useMemo(() => {
    return cartItems.reduce((sum, itm) => {
      const priceCents = getPriceCents(itm.product);
      const qty = Number(itm.quantity) || 0;
      return sum + priceCents * qty;
    }, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => totalPriceCents / 100, [totalPriceCents]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((s, itm) => s + (Number(itm.quantity) || 0), 0);
  }, [cartItems]);

  const isEmpty = cartItems.length === 0;

  // Helpful debug log — remove in production
  // console.debug("CartContext: cartItems:", cartItems, "totalPriceCents:", totalPriceCents);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        isEmpty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartContext must be used within CartProvider");
  return context;
};