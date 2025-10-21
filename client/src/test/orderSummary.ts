export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calculateTotal(
  cart: CartItem[],
  shippingPrice: number
): number {
  return calculateSubtotal(cart) + shippingPrice;
}
