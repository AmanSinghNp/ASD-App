import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, deliveryMethod, address, slotStart, slotEnd } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array required" });
    }

    if (!deliveryMethod || !["Delivery", "Pickup"].includes(deliveryMethod)) {
      return res.status(400).json({ error: "Invalid delivery method" });
    }

    if (deliveryMethod === "Delivery") {
      if (!address) {
        return res.status(400).json({ error: "Address required for delivery" });
      }
      if (!slotStart || !slotEnd) {
        return res.status(400).json({ error: "Delivery slot required" });
      }
    }

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Calculate total and validate stock
      let totalCents = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stockQty < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const itemTotal = product.priceCents * item.quantity;
        totalCents += itemTotal;

        orderItems.push({
          productId: item.productId,
          nameAtPurchase: product.name,
          priceCents: product.priceCents,
          quantity: item.quantity
        });
      }

      // Create order
      const order = await tx.order.create({
        data: {
          deliveryMethod,
          addressLine1: address?.addressLine1 || null,
          suburb: address?.suburb || null,
          state: address?.state || null,
          postcode: address?.postcode || null,
          slotStart: slotStart ? new Date(slotStart) : null,
          slotEnd: slotEnd ? new Date(slotEnd) : null,
          totalCents,
          status: "Processing"
        }
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItems.map(item => ({
          orderId: order.id,
          ...item
        }))
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    res.status(201).json({
      data: {
        orderId: result.id,
        status: result.status
      }
    });
  } catch (error: any) {
    if (error.message.includes("not found") || error.message.includes("Insufficient stock")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create order" });
    }
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Processing", "Packed", "OutForDelivery", "Delivered"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Validate forward-only progression
    const statusOrder = ["Processing", "Packed", "OutForDelivery", "Delivered"];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const newIndex = statusOrder.indexOf(status);

    if (newIndex <= currentIndex) {
      return res.status(400).json({ error: "Status can only progress forward" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({ data: updatedOrder });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
};

