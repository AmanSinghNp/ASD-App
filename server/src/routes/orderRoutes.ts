import express from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrders,
  getOrderStatusHistory,
} from "../controllers/orderController";
import { prisma } from "../index";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * GET /api/orders
 * Admin/staff: Get all orders
 */
router.get("/", getOrders);

/**
 * GET /api/orders/my-orders
 * Customer: Get their own orders
 */
router.get("/my-orders", authenticate, async (req, res) => {
  const userId = (req as any).user?.id;

  try {
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

/**
 * POST /api/orders
 * Create a new order and automatically update product stock
 */
router.post("/", authenticate, async (req, res) => {
  const userId = (req as any).user?.id;

  try {
    const { items, deliveryMethod, totals, address, slotStart, slotEnd } =
      req.body;

    // Step 1️⃣: Create order and items
    const order = await prisma.order.create({
      data: {
        userId,
        deliveryMethod,
        addressLine1: address?.addressLine1,
        suburb: address?.suburb,
        state: address?.state,
        postcode: address?.postcode,
        slotStart: slotStart ? new Date(slotStart) : undefined,
        slotEnd: slotEnd ? new Date(slotEnd) : undefined,
        totalCents: totals.totalCents,
        items: {
          create: await Promise.all(
            items.map(async (item: any) => {
              const product = await prisma.product.findUnique({
                where: { id: item.productId },
              });
              if (!product)
                throw new Error(`Product not found: ${item.productId}`);
              if (product.stockQty < item.quantity)
                throw new Error(`Insufficient stock for ${product.name}`);

              return {
                productId: item.productId,
                nameAtPurchase: product.name,
                priceCents: product.priceCents,
                quantity: item.quantity,
              };
            })
          ),
        },
      },
      include: { items: true },
    });

    // Step 2️⃣: Deduct stock & record stock change
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (product) {
        const newQty = product.stockQty - item.quantity;

        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQty: newQty },
        });

        await prisma.stockHistory.create({
          data: {
            productId: item.productId,
            userId,
            oldQuantity: product.stockQty,
            newQuantity: newQty,
            changeType: "purchase",
            reason: `Order #${order.id}`,
          },
        });
      }
    }

    res.status(201).json({
      data: { orderId: order.id, status: order.status },
    });
  } catch (err: any) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: err.message || "Failed to create order" });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Update order status (admin/staff)
 */
router.patch("/:id/status", updateOrderStatus);

/**
 * GET /api/orders/:id/status-history
 * View order status change timeline
 */
router.get("/:id/status-history", getOrderStatusHistory);

export default router;
