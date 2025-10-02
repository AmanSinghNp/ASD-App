import express from "express";
import { createOrder, updateOrderStatus } from "../controllers/orderController";

const router = express.Router();

// POST /api/orders
router.post("/", createOrder);

// PATCH /api/orders/:id/status
router.patch("/:id/status", updateOrderStatus);

export default router;

