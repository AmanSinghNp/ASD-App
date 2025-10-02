import { describe, it, expect } from "vitest";
import { calculateSubtotal, calculateTotal } from "../test/orderSummary";

describe("Order Summary Calculations", () => {
  const cart = [
    { id: "1", name: "Shirt", price: 20, quantity: 2 },
    { id: "2", name: "Shoes", price: 50, quantity: 1 },
  ];

  it("calculates subtotal correctly", () => {
    const subtotal = calculateSubtotal(cart);
    expect(subtotal).toBe(90); // 40 + 50
  });

  it("calculates total correctly with shipping", () => {
    const shipping = 15;
    const total = calculateTotal(cart, shipping);
    expect(total).toBe(105); // 90 + 15
  });
});
