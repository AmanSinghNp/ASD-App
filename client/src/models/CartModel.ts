import type { Product } from '../models/ProductCatalogueModel';

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export class CartModel {
  private items: CartItem[] = [];

  // Add item to cart
  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        quantity: quantity,
        product: product
      });
    }
  }

  // Remove item from cart
  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  // Get all cart items
  getItems(): CartItem[] {
    return this.items;
  }

  // Get total price
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Get total number of items
  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Clear cart
  clearCart(): void {
    this.items = [];
  }

  // Check if product is in cart
  isInCart(productId: string): boolean {
    return this.items.some(item => item.productId === productId);
  }

  // Get item quantity
  getItemQuantity(productId: string): number {
    const item = this.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }
}