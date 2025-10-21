import express from "express";
import { createOrder, updateOrderStatus, getOrders, getOrderStatusHistory } from "../controllers/orderController";
import { prisma } from "../index";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/orders - Get all orders
router.get("/", getOrders);

// POST /api/orders - Create new order
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


// PATCH /api/orders/:id/status - Update order status
router.patch("/:id/status", updateOrderStatus);

// GET /api/orders/:id/status-history - Get order status history timeline
router.get("/:id/status-history", getOrderStatusHistory);

export default router;
