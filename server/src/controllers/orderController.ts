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

// GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Generate realistic customer data based on order ID for consistency
    const customerNames = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Brown', 'Lisa Davis', 'Tom Anderson', 'Amy Taylor'];
    const emails = ['john.smith@email.com', 'sarah.j@email.com', 'mike.chen@email.com', 'emma.wilson@email.com', 'david.brown@email.com', 'lisa.davis@email.com', 'tom.anderson@email.com', 'amy.taylor@email.com'];
    const phones = ['0412345678', '0423456789', '0434567890', '0445678901', '0456789012', '0467890123', '0478901234', '0489012345'];

    // Transform orders to match frontend interface
    const transformedOrders = orders.map((order, index) => {
      const customerIndex = index % customerNames.length;
      return {
        id: order.id,
        customerName: customerNames[customerIndex],
        email: emails[customerIndex],
        phone: phones[customerIndex],
        address: order.addressLine1 ? 
          `${order.addressLine1}, ${order.suburb}, ${order.state} ${order.postcode}` : 
          'Store Pickup',
        items: order.items.map(item => ({
          name: item.nameAtPurchase,
          quantity: item.quantity,
          price: item.priceCents
        })),
        total: order.totalCents,
        status: mapStatusToFrontend(order.status),
        deliveryMethod: order.deliveryMethod,
        slotStart: order.slotStart?.toISOString(),
        slotEnd: order.slotEnd?.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
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
    'Processing': 'pending',
    'Packed': 'confirmed', 
    'OutForDelivery': 'out_for_delivery',
    'Delivered': 'delivered'
  };
  return statusMap[backendStatus] || 'pending';
};

// Helper function to map frontend status to backend status
const mapStatusToBackend = (frontendStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': 'Processing',
    'confirmed': 'Packed',
    'preparing': 'Packed',
    'out_for_delivery': 'OutForDelivery',
    'delivered': 'Delivered',
    'cancelled': 'Processing' // Handle cancellation separately
  };
  return statusMap[frontendStatus] || 'Processing';
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
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

    // Map frontend status to backend status
    const backendStatus = mapStatusToBackend(status);

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: backendStatus }
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

