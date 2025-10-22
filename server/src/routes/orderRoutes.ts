import express from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrders,
  getOrderStatusHistory,
} from "../controllers/orderController";
import { requireAuth, requireAdmin } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";
import { prisma } from "../index";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/orders - Get all orders (Admin only for delivery interface)
router.get("/", requireAuth, requireAdmin, getOrders);

// GET /api/orders/my-orders - Get current user's orders
router.get("/my-orders", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: orders });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// POST /api/orders - Create new order (Public - customers can create orders)
router.post("/", createOrder);

// PATCH /api/orders/:id/status - Update order status
router.get("/my-orders", authenticate, async (req, res) => {
  const userId = (req as any).user?.id;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// POST /api/orders - Create new order
router.post("/", createOrder);

router.post("/", authenticate, async (req, res) => {
  const userId = (req as any).user?.id;

  try {
    const {
      items,
      deliveryMethod,
      totals,
      address,
      slotStart,
      slotEnd,
    } = req.body;

    const order = await prisma.order.create({
      data: {
        userId, // ✅ Save user ID
        deliveryMethod,
        addressLine1: address?.addressLine1,
        suburb: address?.suburb,
        state: address?.state,
        postcode: address?.postcode,
        slotStart: slotStart ? new Date(slotStart) : undefined,
        slotEnd: slotEnd ? new Date(slotEnd) : undefined,
        totalCents: totals.totalCents,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            nameAtPurchase: "Some name", // optionally fetch name here if needed
            priceCents: 1000, // optionally fetch price from DB
            quantity: item.quantity,
          })),
        },
      },
    });

    res.status(201).json({ data: { orderId: order.id, status: order.status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});


// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

// GET /api/orders/:id/status-history - Get order status history timeline (Admin only)
router.get("/:id/status-history", requireAuth, requireAdmin, getOrderStatusHistory);

export default router;
