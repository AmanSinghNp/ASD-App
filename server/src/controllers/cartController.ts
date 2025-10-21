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
 * GET /api/cart
 * Get or create cart for the authenticated user (F002 - Cart)
 * @param req - Express request object with JWT token
 * @param res - Express response object
 */
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Get or create cart for user
    let cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: "OPEN",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                imageUrl: true,
                stockQty: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    // Create new cart if none exists
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          status: "OPEN",
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  priceCents: true,
                  imageUrl: true,
                  stockQty: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    const totalCents = cart.items.reduce((sum, item) => {
      return sum + item.product.priceCents * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    res.json({
      cart: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        })),
        totalCents,
        totalItems,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Get cart error:", error);
    res.status(500).json({
      error: "Failed to get cart",
    });
  }
};

/**
 * POST /api/cart/items
 * Add item to cart (F002 - Cart)
 * @param req - Express request object with { productId, quantity } in body
 * @param res - Express response object
 */
export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const { productId, quantity = 1 } = req.body;

    // Input validation
    if (!productId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        error: "Quantity must be a positive integer",
      });
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        error: "Product not found or unavailable",
      });
    }

    // Check stock availability
    if (product.stockQty < quantity) {
      return res.status(400).json({
        error: `Only ${product.stockQty} items available in stock`,
      });
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: "OPEN",
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          status: "OPEN",
        },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity;

      // Check stock again for total quantity
      if (product.stockQty < newQuantity) {
        return res.status(400).json({
          error: `Only ${product.stockQty} items available in stock`,
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              priceCents: true,
              imageUrl: true,
              stockQty: true,
              isActive: true,
            },
          },
        },
      });

      res.json({
        message: "Item quantity updated in cart",
        item: updatedItem,
      });
    } else {
      // Add new item to cart
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              priceCents: true,
              imageUrl: true,
              stockQty: true,
              isActive: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Item added to cart",
        item: newItem,
      });
    }
  } catch (error: any) {
    console.error("Add item to cart error:", error);
    res.status(500).json({
      error: "Failed to add item to cart",
    });
  }
};

/**
 * PUT /api/cart/items/:itemId
 * Update cart item quantity (F002 - Cart)
 * @param req - Express request object with itemId in params and { quantity } in body
 * @param res - Express response object
 */
export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    // Input validation
    if (quantity < 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        error: "Quantity must be a non-negative integer",
      });
    }

    // Get cart item with product info
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    // Verify cart belongs to user
    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      });

      return res.json({
        message: "Item removed from cart",
      });
    }

    // Check stock availability
    if (cartItem.product.stockQty < quantity) {
      return res.status(400).json({
        error: `Only ${cartItem.product.stockQty} items available in stock`,
      });
    }

    // Update item quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            priceCents: true,
            imageUrl: true,
            stockQty: true,
            isActive: true,
          },
        },
      },
    });

    res.json({
      message: "Cart item updated",
      item: updatedItem,
    });
  } catch (error: any) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      error: "Failed to update cart item",
    });
  }
};

/**
 * DELETE /api/cart/items/:itemId
 * Remove item from cart (F002 - Cart)
 * @param req - Express request object with itemId in params
 * @param res - Express response object
 */
export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const { itemId } = req.params;

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    // Verify cart belongs to user
    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // Remove item from cart
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({
      message: "Item removed from cart",
    });
  } catch (error: any) {
    console.error("Remove cart item error:", error);
    res.status(500).json({
      error: "Failed to remove cart item",
    });
  }
};

/**
 * DELETE /api/cart
 * Clear all items from cart (F002 - Cart)
 * @param req - Express request object with JWT token
 * @param res - Express response object
 */
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Get user's open cart
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: "OPEN",
      },
    });

    if (!cart) {
      return res.json({
        message: "Cart is already empty",
      });
    }

    // Remove all items from cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({
      message: "Cart cleared successfully",
    });
  } catch (error: any) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      error: "Failed to clear cart",
    });
  }
};

/**
 * GET /api/cart/total
 * Get cart total calculation (F002 - Cart)
 * @param req - Express request object with JWT token
 * @param res - Express response object
 */
export const getCartTotal = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Get cart with items
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: "OPEN",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                priceCents: true,
                stockQty: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.json({
        totalCents: 0,
        totalItems: 0,
        items: [],
      });
    }

    // Calculate totals
    const totalCents = cart.items.reduce((sum, item) => {
      return sum + item.product.priceCents * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    res.json({
      totalCents,
      totalItems,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceCents: item.product.priceCents,
        totalCents: item.product.priceCents * item.quantity,
      })),
    });
  } catch (error: any) {
    console.error("Get cart total error:", error);
    res.status(500).json({
      error: "Failed to get cart total",
    });
  }
};
