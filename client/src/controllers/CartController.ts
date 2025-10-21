import { CartModel, type CartItem } from '../models/CartModel';
import type { Product } from '../models/ProductCatalogueModel';

export class CartController {
  private model: CartModel;

  constructor() {
    this.model = new CartModel();
  }

  // Add product to cart
  addToCart(product: Product, quantity: number = 1): boolean {
    try {
      // Check if product has stock
      if (product.stockQty <= 0) {
        throw new Error('Product is out of stock');
      }

      // Enforce maximum quantity limit per product
      const MAX_QTY = 20;
      const currentQuantity = this.model.getItemQuantity(product.id);
      const allowedQty = Math.min(quantity, MAX_QTY - currentQuantity, product.stockQty - currentQuantity);
      if (allowedQty <= 0) {
        throw new Error('Maximum quantity reached or not enough stock available');
      }

      // Decrement stock in the product catalogue model (singleton)
      try {
        const { ProductCatalogueModel } = require('../models/ProductCatalogueModel');
        const catalogue = ProductCatalogueModel.getInstance();
        const stockDecremented = catalogue.decrementStock(product.id, allowedQty);
        if (!stockDecremented) throw new Error('Failed to decrement stock');
      } catch (e) {
        console.warn('Stock decrement not applied globally. Ensure shared model instance if needed.');
      }
      this.model.addItem(product, allowedQty);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  // Remove item from cart
  removeFromCart(productId: string): boolean {
    try {
      this.model.removeItem(productId);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number): boolean {
    try {
      if (quantity < 0) {
        throw new Error('Quantity cannot be negative');
      }
      const MAX_QTY = 20;
      const newQty = Math.min(quantity, MAX_QTY);
      this.model.updateQuantity(productId, newQty);
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  // Get all cart items
  getCartItems(): CartItem[] {
    try {
      return this.model.getItems();
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  // Get total price
  getTotalPrice(): number {
    try {
      return this.model.getTotalPrice();
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  }

  // Get total number of items
  getTotalItems(): number {
    try {
      return this.model.getTotalItems();
    } catch (error) {
      console.error('Error calculating total items:', error);
      return 0;
    }
  }

  // Clear cart
  clearCart(): boolean {
    try {
      this.model.clearCart();
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Check if cart is empty
  isEmpty(): boolean {
    return this.model.getItems().length === 0;
  }

  // Check if product is in cart
  isInCart(productId: string): boolean {
    return this.model.isInCart(productId);
  }

  // Get item quantity
  getItemQuantity(productId: string): number {
    return this.model.getItemQuantity(productId);
  }
}