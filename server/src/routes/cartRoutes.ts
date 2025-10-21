import express from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  getCartTotal,
} from "../controllers/cartController";

const router = express.Router();

// GET /api/cart - Get or create cart for user (requires auth)
router.get("/", getCart);

// POST /api/cart/items - Add item to cart (requires auth)
router.post("/items", addItem);

// PUT /api/cart/items/:itemId - Update cart item quantity (requires auth)
router.put("/items/:itemId", updateItem);

// DELETE /api/cart/items/:itemId - Remove item from cart (requires auth)
router.delete("/items/:itemId", removeItem);

// DELETE /api/cart - Clear all items from cart (requires auth)
router.delete("/", clearCart);

// GET /api/cart/total - Get cart total calculation (requires auth)
router.get("/total", getCartTotal);

export default router;
