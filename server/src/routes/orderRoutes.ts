import express from "express";
import prisma from "../utils/database";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { authenticate } from "../middleware/authMiddleware";
import type { AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid"; // ← Add this

const router = express.Router();

/**
 * GET /api/orders - Admin only: view all orders
 */
router.get("/", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ data: orders });
  } catch (err) {
    console.error("❌ Error getting all orders:", err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * GET /api/orders/my-orders - Customer: view their own orders
 */
router.get("/my-orders", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ data: orders });
  } catch (err) {
    console.error("❌ Error getting user orders:", err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * POST /api/orders - Create a new order (Customer)
 */
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    const {
      items,
      deliveryMethod,
      totals,
      address,
      slotStart,
      slotEnd,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }
    if (typeof deliveryMethod !== "string") {
      return res.status(400).json({ error: "Invalid deliveryMethod" });
    }
    if (!totals || typeof totals.totalCents !== "number") {
      return res.status(400).json({ error: "Invalid totals" });
    }

    // Build OrderItem create array
    const orderItemsData = await Promise.all(
      items.map(async (item: any) => {
        if ((typeof item.productId !== "string" && typeof item.productId !== "number") || typeof item.quantity !== "number") {
          throw new Error("Invalid item format");
        }

        const rawId = String(item.productId);

        // Try resolving by primary id first; if not found, try by SKU; as a last resort, try with 'PROD-' prefix
        let product = await prisma.product.findUnique({ where: { id: rawId } });
        if (!product) {
          product = await prisma.product.findUnique({ where: { sku: rawId } });
        }
        if (!product && !rawId.startsWith("PROD-")) {
          product = await prisma.product.findUnique({ where: { id: `PROD-${rawId}` } });
        }
        if (!product) {
          throw new Error(`Product not found: ${rawId}`);
        }
        return {
          productId: product.id,
          nameAtPurchase: product.name,
          priceCents: product.priceCents,
          quantity: item.quantity,
        };
      })
    );

    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        userId,
        deliveryMethod,
        addressLine1: address?.addressLine1 ?? null,
        suburb: address?.suburb ?? null,
        state: address?.state ?? null,
        postcode: address?.postcode ?? null,
        slotStart: slotStart ? new Date(slotStart) : null,
        slotEnd: slotEnd ? new Date(slotEnd) : null,
        totalCents: totals.totalCents,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({
      data: {
        orderId: order.id,
        status: order.status,
      },
    });
  } catch (err: any) {
    console.error("❌ Error creating order:", err);
    return res.status(500).json({ error: err.message || "Failed to create order" });
  }
});

/**
 * PATCH /api/orders/:id/status - Admin: update order status
 */
router.patch("/:id/status", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (typeof status !== "string") {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return res.json({ data: updated });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    return res.status(500).json({ error: "Failed to update order status" });
  }
});

/**
 * GET /api/orders/:id/status-history - Admin: get status timeline
 */
router.get("/:id/status-history", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const history = await prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { createdAt: "asc" },
    });
    return res.json({ data: history });
  } catch (err) {
    console.error("❌ Error getting status history:", err);
    return res.status(500).json({ error: "Failed to fetch status history" });
  }
});

export default router;
