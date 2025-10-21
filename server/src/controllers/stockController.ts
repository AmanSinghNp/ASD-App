import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/database";

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

/**
 * GET /api/stock/:productId/history
 * Get stock change history for a specific product (F006 - Stock Management)
 * @param req - Express request object with productId in params
 * @param res - Express response object
 */
export const getStockHistory = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stockQty: true },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // Get stock history for the product
    const stockHistory = await prisma.stockHistory.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      product: {
        id: product.id,
        name: product.name,
        currentStock: product.stockQty,
      },
      history: stockHistory.map((entry) => ({
        id: entry.id,
        oldQuantity: entry.oldQuantity,
        newQuantity: entry.newQuantity,
        changeType: entry.changeType,
        reason: entry.reason,
        changedBy: entry.user
          ? {
              id: entry.user.id,
              name: entry.user.name,
              role: entry.user.role,
            }
          : null,
        createdAt: entry.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Get stock history error:", error);
    res.status(500).json({
      error: "Failed to get stock history",
    });
  }
};

/**
 * PUT /api/stock/:productId
 * Update stock quantity with automatic history logging (F006 - Stock Management)
 * @param req - Express request object with { quantity, reason } in body
 * @param res - Express response object
 */
export const updateStock = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const { productId } = req.params;
    const { quantity, reason } = req.body;

    // Input validation
    if (
      typeof quantity !== "number" ||
      quantity < 0 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        error: "Quantity must be a non-negative integer",
      });
    }

    // Get current product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // Use transaction to update stock and log history
    const result = await prisma.$transaction(async (tx) => {
      const oldQuantity = product.stockQty;

      // Update product stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stockQty: quantity },
      });

      // Log stock change in history
      await tx.stockHistory.create({
        data: {
          productId,
          userId,
          oldQuantity,
          newQuantity: quantity,
          changeType: "admin_update",
          reason: reason || "Manual stock adjustment",
        },
      });

      return updatedProduct;
    });

    res.json({
      message: "Stock updated successfully",
      product: {
        id: result.id,
        name: result.name,
        stockQty: result.stockQty,
      },
    });
  } catch (error: any) {
    console.error("Update stock error:", error);
    res.status(500).json({
      error: "Failed to update stock",
    });
  }
};

/**
 * POST /api/stock/check-availability
 * Check stock availability for multiple products (F006 - Stock Management)
 * @param req - Express request object with { items: [{ productId, quantity }] } in body
 * @param res - Express response object
 */
export const checkStockAvailability = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    // Input validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Items array is required",
      });
    }

    // Get all product IDs
    const productIds = items.map((item: any) => item.productId);

    // Fetch all products
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        stockQty: true,
      },
    });

    // Check availability for each item
    const availability = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        return {
          productId: item.productId,
          available: false,
          requestedQuantity: item.quantity,
          availableQuantity: 0,
          error: "Product not found or inactive",
        };
      }

      const available = product.stockQty >= item.quantity;

      return {
        productId: item.productId,
        productName: product.name,
        available,
        requestedQuantity: item.quantity,
        availableQuantity: product.stockQty,
        error: available ? null : `Only ${product.stockQty} items available`,
      };
    });

    const allAvailable = availability.every((item) => item.available);

    res.json({
      allAvailable,
      availability,
    });
  } catch (error: any) {
    console.error("Check stock availability error:", error);
    res.status(500).json({
      error: "Failed to check stock availability",
    });
  }
};

/**
 * GET /api/stock/low-stock
 * Get products with low stock levels (F006 - Stock Management)
 * @param req - Express request object with optional threshold query parameter
 * @param res - Express response object
 */
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 10;

    // Get products with low stock
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stockQty: { lte: threshold },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        stockQty: true,
        priceCents: true,
        imageUrl: true,
      },
      orderBy: { stockQty: "asc" },
    });

    res.json({
      threshold,
      count: lowStockProducts.length,
      products: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        stockQty: product.stockQty,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        status: product.stockQty === 0 ? "out_of_stock" : "low_stock",
      })),
    });
  } catch (error: any) {
    console.error("Get low stock products error:", error);
    res.status(500).json({
      error: "Failed to get low stock products",
    });
  }
};

/**
 * Internal function to log stock changes during order processing
 * This is called by the order controller when processing orders
 * @param productId - ID of the product
 * @param oldQuantity - Previous stock quantity
 * @param newQuantity - New stock quantity
 * @param changeType - Type of change (purchase, restock, etc.)
 * @param reason - Reason for the change
 * @param userId - ID of user who made the change (optional)
 */
export const logStockChange = async (
  productId: string,
  oldQuantity: number,
  newQuantity: number,
  changeType: string,
  reason?: string,
  userId?: string
) => {
  try {
    await prisma.stockHistory.create({
      data: {
        productId,
        userId,
        oldQuantity,
        newQuantity,
        changeType,
        reason,
      },
    });
  } catch (error) {
    console.error("Failed to log stock change:", error);
    // Don't throw error as this is a logging function
  }
};
