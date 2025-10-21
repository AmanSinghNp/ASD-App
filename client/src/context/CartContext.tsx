import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { CartController } from "../controllers/CartController";
import type { CartItem } from "../models/CartModel";

// --- Singleton pattern for CartController ---
let globalCartController: CartController | null = null;
function getCartController() {
  if (!globalCartController) globalCartController = new CartController();
  return globalCartController;
}

// --- Context type definition ---
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => boolean;
  removeFromCart: (productId: string) => boolean;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => boolean;
  totalPrice: number; // dollars
  totalItems: number;
  isEmpty: boolean;
}

// --- Context creation ---
const CartContext = createContext<CartContextType | null>(null);

// --- Provider component ---
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const controller = useMemo(() => getCartController(), []);
  const [cartItems, setCartItems] = useState<CartItem[]>(
    controller.getCartItems()
  );

  // Force update cart with new reference (so React re-renders)
  const refreshCart = useCallback(() => {
    setCartItems([...controller.getCartItems()]);
  }, [controller]);

  // --- Cart operations ---
  const addToCart = useCallback(
    (product: any, quantity: number = 1) => {
      const success = controller.addToCart(product, quantity);
      if (success) refreshCart();
      return success;
    },
    [controller, refreshCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const success = controller.removeFromCart(productId);
      if (success) refreshCart();
      return success;
    },
    [controller, refreshCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const success = controller.updateQuantity(productId, quantity);
      if (success) refreshCart();
      return success;
    },
    [controller, refreshCart]
  );

  const clearCart = useCallback(() => {
    const success = controller.clearCart();
    if (success) refreshCart();
    return success;
  }, [controller, refreshCart]);

  // --- Derived values ---
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price =
        typeof item.product.price !== "undefined"
          ? item.product.price / 100
          : item.product.price || 0;
      return sum + price * (Number(item.quantity) || 0);
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    );
  }, [cartItems]);

  const isEmpty = cartItems.length === 0;

  // --- Provider value ---
  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    isEmpty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- Hook for using the context safely ---
export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
