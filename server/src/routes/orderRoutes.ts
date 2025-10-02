import express from "express";
import { createOrder, updateOrderStatus, getOrders } from "../controllers/orderController";

const router = express.Router();

// GET /api/orders
router.get("/", getOrders);

// POST /api/orders
router.post("/", createOrder);

// PATCH /api/orders/:id/status
router.patch("/:id/status", updateOrderStatus);

export default router;

