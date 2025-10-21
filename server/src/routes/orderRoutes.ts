import express from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrders,
  getOrderStatusHistory,
} from "../controllers/orderController";

const router = express.Router();

// GET /api/orders - Get all orders
router.get("/", getOrders);

// POST /api/orders - Create new order
router.post("/", createOrder);

// PATCH /api/orders/:id/status - Update order status
router.patch("/:id/status", updateOrderStatus);

// GET /api/orders/:id/status-history - Get order status history timeline
router.get("/:id/status-history", getOrderStatusHistory);

export default router;
