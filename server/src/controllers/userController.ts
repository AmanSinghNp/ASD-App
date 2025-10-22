import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/database";

dotenv.config();

const SECRET = process.env.JWT_SECRET!;

/**
 * POST /api/users/signup
 * Create a new user account with email, password, and name
 * @param req - Express request object with { name, email, password } in body
 * @param res - Express response object
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "CUSTOMER", // Default role
      },
    });

    // Create JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Failed to create account. Please try again.",
    });
  }
};

/**
 * POST /api/users/login
 * Authenticate user with email and password
 * @param req - Express request object with { email, password } in body
 * @param res - Express response object
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed. Please try again.",
    });
  }
};

/**
 * GET /api/users/profile
 * Get user profile information (requires authentication)
 * @param req - Express request object with JWT token in Authorization header
 * @param res - Express response object
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET) as { id: string; role: string };

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({ user });
  } catch (error: any) {
    console.error("Get profile error:", error);
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        error: "Invalid authentication token",
      });
    } else {
      res.status(500).json({
        error: "Failed to get profile",
      });
    }
  }
};

/**
 * PUT /api/users/profile
 * Update user profile information (requires authentication)
 * @param req - Express request object with JWT token and { name, email } in body
 * @param res - Express response object
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const { name, email } = req.body;

    // Input validation
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET) as { id: string; role: string };

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Generate new JWT token with updated info
    const newToken = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
      token: newToken,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    if (error.code === "P2002") {
      res.status(400).json({
        error: "Email already exists",
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        error: "Invalid authentication token",
      });
    } else if (error.code === "P2025") {
      res.status(404).json({
        error: "User not found",
      });
    } else {
      res.status(500).json({
        error: "Failed to update profile",
      });
    }
  }
};

/**
 * DELETE /api/users/account
 * Delete user account (requires authentication)
 * @param req - Express request object with JWT token
 * @param res - Express response object
 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET) as { id: string };

    // Delete user account (cascade will handle related records)
    await prisma.user.delete({
      where: { id: decoded.id },
    });

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete account error:", error);
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        error: "Invalid authentication token",
      });
    } else if (error.code === "P2025") {
      res.status(404).json({
        error: "User not found",
      });
    } else {
      res.status(500).json({
        error: "Failed to delete account",
      });
    }
  }
};

/**
 * GET /api/users/orders
 * Get order history for the authenticated user (F010 - Order Logs)
 * @param req - Express request object with JWT token
 * @param res - Express response object
 */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET) as { id: string };

    // Get user's order history
    const orders = await prisma.order.findMany({
      where: { userId: decoded.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform orders for frontend
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalCents: order.totalCents,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod,
      address: order.addressLine1
        ? `${order.addressLine1}, ${order.suburb}, ${order.state} ${order.postcode}`
        : "Store Pickup",
      slotStart: order.slotStart?.toISOString(),
      slotEnd: order.slotEnd?.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.nameAtPurchase,
        quantity: item.quantity,
        priceCents: item.priceCents,
        product: item.product,
      })),
      statusHistory: order.statusHistory.map((status) => ({
        id: status.id,
        status: status.status,
        notes: status.notes,
        createdAt: status.createdAt.toISOString(),
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    res.json({
      orders: transformedOrders,
      total: transformedOrders.length,
    });
  } catch (error: any) {
    console.error("Get user orders error:", error);
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        error: "Invalid authentication token",
      });
    } else {
      res.status(500).json({
        error: "Failed to get order history",
      });
    }
  }
};
