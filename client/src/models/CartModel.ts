import type { Product } from '../models/ProductCatalogueModel';

export interface CartItem {
  quantity: number;
  product: Product;
}

export class CartModel {
  private items: CartItem[] = [];

  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        quantity,
        product,
      });
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.items = [];
  }

  isInCart(productId: string): boolean {
    return this.items.some(item => item.product.id === productId);
  }

  getItemQuantity(productId: string): number {
    const item = this.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}
