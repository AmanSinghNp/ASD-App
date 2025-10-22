import express from "express";
import {
  createOrder,
  updateOrderStatus,
  getOrders,
  getOrderStatusHistory,
} from "../controllers/orderController";
import { prisma } from "../index";
import { authenticate } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.JWT_SECRET!;

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
router.post("/", async (req, res) => {
  // Optional auth: extract userId if a valid token is provided
  let userId: string | null = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET) as { id: string };
      userId = decoded.id;
    } catch (_) {
      // ignore invalid tokens for guest checkout
      userId = null;
    }
  }

  try {
    const { items, deliveryMethod, totals, address, slotStart, slotEnd } =
      req.body;

    // Step 1️⃣: Create order and items
    const order = await prisma.order.create({
      data: {
        userId: userId ?? null,
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
              const variants: any[] = [];
              if (item?.productId) variants.push({ id: String(item.productId) });
              if (item?.sku) variants.push({ sku: String(item.sku) });
              const pid = String(item?.productId ?? "");
              if (/^\d+$/.test(pid)) {
                const padded = pid.padStart(3, "0");
                variants.push({ sku: { endsWith: `-${padded}` } });
              }
              const product = await prisma.product.findFirst({
                where: { OR: variants },
              });
              if (!product)
                throw new Error(`Product not found: ${item.productId}`);
              if (product.stockQty < item.quantity)
                throw new Error(`Insufficient stock for ${product.name}`);

              return {
                productId: product.id,
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
      const variants: any[] = [];
      if (item?.productId) variants.push({ id: String(item.productId) });
      if (item?.sku) variants.push({ sku: String(item.sku) });
      const pid = String(item?.productId ?? "");
      if (/^\d+$/.test(pid)) {
        const padded = pid.padStart(3, "0");
        variants.push({ sku: { endsWith: `-${padded}` } });
      }
      const product = await prisma.product.findFirst({ where: { OR: variants } });
      if (product) {
        const newQty = product.stockQty - item.quantity;

        await prisma.product.update({
          where: { id: product.id },
          data: { stockQty: newQty },
        });

        await prisma.stockHistory.create({
          data: {
            productId: product.id,
            userId: userId ?? null,
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
