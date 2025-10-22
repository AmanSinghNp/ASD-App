/**
 * Order Management Controller
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F008 - Delivery
 * Description: Handles order creation, status updates, and order management for delivery system
 * Last Updated: 2025-10-22
 */

import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/database";
import { cache } from "../utils/cache";

dotenv.config();

const SECRET = process.env.JWT_SECRET!;

/**
 * Helper function to verify JWT token and get user ID
 * @param authHeader - Authorization header from request
 * @returns User ID if token is valid, null otherwise
 */
const getUserIdFromToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    const {
      items,
      deliveryMethod,
      address,
      slotStart,
      slotEnd,
      paymentMethod,
    } = req.body;

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
          where: { id: item.productId },
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
          quantity: item.quantity,
        });
      }

      // Create order with payment information
      const order = await tx.order.create({
        data: {
          userId: userId || null,
          deliveryMethod,
          addressLine1: address?.addressLine1 || null,
          suburb: address?.suburb || null,
          state: address?.state || null,
          postcode: address?.postcode || null,
          slotStart: slotStart ? new Date(slotStart) : null,
          slotEnd: slotEnd ? new Date(slotEnd) : null,
          totalCents,
          paymentMethod: paymentMethod || "cash_on_delivery",
          paymentStatus: "pending",
          status: "Processing",
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          ...item,
        })),
      });

      // Create initial status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "Processing",
          notes: "Order created successfully",
        },
      });

      // Update product stock and log stock changes
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          const oldQuantity = product.stockQty;
          const newQuantity = oldQuantity - item.quantity;

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQty: newQuantity,
            },
          });

          // Log stock change
          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              userId: userId || null,
              oldQuantity,
              newQuantity,
              changeType: "purchase",
              reason: `Order ${order.id} - ${item.quantity} units sold`,
            },
          });
        }
      }

      return order;
    });

    // Clear analytics cache when orders are created
    cache.clear();

    res.status(201).json({
      data: {
        orderId: result.id,
        status: result.status,
        paymentMethod: result.paymentMethod,
        paymentStatus: result.paymentStatus,
      },
    });
  } catch (error: any) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Insufficient stock")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create order" });
    }
  }
};

// GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform orders to match frontend interface
    const transformedOrders = orders.map((order) => {
      return {
        id: order.id,
        customerName: order.user?.name || "Guest Customer",
        email: order.user?.email || "guest@example.com",
        phone: "N/A", // Phone not stored in current schema
        address: order.addressLine1
          ? `${order.addressLine1}, ${order.suburb}, ${order.state} ${order.postcode}`
          : "Store Pickup",
        items: order.items.map((item) => ({
          name: item.nameAtPurchase,
          quantity: item.quantity,
          price: item.priceCents,
        })),
        total: order.totalCents,
        status: mapStatusToFrontend(order.status),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryMethod: order.deliveryMethod,
        slotStart: order.slotStart?.toISOString(),
        slotEnd: order.slotEnd?.toISOString(),
        statusHistory: order.statusHistory.map((status) => ({
          id: status.id,
          status: status.status,
          notes: status.notes,
          createdAt: status.createdAt.toISOString(),
        })),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    });

    res.json({ data: transformedOrders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Helper function to map backend status to frontend status
const mapStatusToFrontend = (backendStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    Processing: "pending",
    Packed: "confirmed",
    OutForDelivery: "out_for_delivery",
    Delivered: "delivered",
  };
  return statusMap[backendStatus] || "pending";
};

// Helper function to map frontend status to backend status
const mapStatusToBackend = (frontendStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "Processing",
    confirmed: "Packed",
    preparing: "Packed",
    out_for_delivery: "OutForDelivery",
    delivered: "Delivered",
    cancelled: "Processing", // Handle cancellation separately
  };
  return statusMap[frontendStatus] || "Processing";
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Map frontend status to backend status
    const backendStatus = mapStatusToBackend(status);

    // Use transaction to update order and log status change
    const result = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: backendStatus },
      });

      // Log status change in history
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: backendStatus,
          notes: notes || `Status changed to ${backendStatus}`,
        },
      });

      return updatedOrder;
    });

    res.json({
      data: {
        id: result.id,
        status: mapStatusToFrontend(result.status),
        paymentMethod: result.paymentMethod,
        paymentStatus: result.paymentStatus,
        updatedAt: result.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
};

/**
 * GET /api/orders/:id/status-history
 * Get order status history timeline (F008 - Delivery)
 * @param req - Express request object with order ID in params
 * @param res - Express response object
 */
export const getOrderStatusHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Get status history
    const statusHistory = await prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { createdAt: "asc" },
    });

    res.json({
      orderId: order.id,
      currentStatus: mapStatusToFrontend(order.status),
      statusHistory: statusHistory.map((status) => ({
        id: status.id,
        status: mapStatusToFrontend(status.status),
        notes: status.notes,
        createdAt: status.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Get order status history error:", error);
    res.status(500).json({
      error: "Failed to get order status history",
    });
  }
};
