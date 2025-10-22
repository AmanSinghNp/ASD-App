import express from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrders,
  getOrderStatusHistory,
} from "../controllers/orderController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = express.Router();

// GET /api/orders - Get all orders (Admin only for delivery interface)
router.get("/", requireAuth, requireAdmin, getOrders);

// POST /api/orders - Create new order (Public - customers can create orders)
router.post("/", createOrder);

// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

// GET /api/orders/:id/status-history - Get order status history timeline (Admin only)
router.get("/:id/status-history", requireAuth, requireAdmin, getOrderStatusHistory);

export default router;
