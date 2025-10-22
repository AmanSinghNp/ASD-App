import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/database";

dotenv.config();

const SECRET = process.env.JWT_SECRET!;

/**
 * Helper function to verify JWT token and get user info
 * @param authHeader - Authorization header from request
 * @returns User info if token is valid, null otherwise
 */
const getUserFromToken = (
  authHeader: string | undefined
): { id: string; role: string } | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as { id: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * GET /api/faqs
 * Get all FAQs or filter by category (F009 - Customer Support Chat)
 * @param req - Express request object with optional category query parameter
 * @param res - Express response object
 */
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    // Build where clause
    const whereClause: any = { isActive: true };
    if (category && typeof category === "string") {
      whereClause.category = category;
    }

    // Get FAQs from database
    const faqs = await prisma.fAQ.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Get available categories
    const categories = await prisma.fAQ.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });

    res.json({
      faqs: faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt.toISOString(),
      })),
      categories: categories.map((cat) => cat.category),
      total: faqs.length,
    });
  } catch (error: any) {
    console.error("Get FAQs error:", error);
    res.status(500).json({
      error: "Failed to get FAQs",
    });
  }
};

/**
 * GET /api/faqs/:id
 * Get a specific FAQ by ID (F009 - Customer Support Chat)
 * @param req - Express request object with FAQ ID in params
 * @param res - Express response object
 */
export const getFAQById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return res.status(404).json({
        error: "FAQ not found",
      });
    }

    res.json({
      faq: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        isActive: faq.isActive,
        createdAt: faq.createdAt.toISOString(),
        updatedAt: faq.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Get FAQ by ID error:", error);
    res.status(500).json({
      error: "Failed to get FAQ",
    });
  }
};

/**
 * POST /api/faqs
 * Create a new FAQ (admin only) (F009 - Customer Support Chat)
 * @param req - Express request object with { question, answer, category } in body
 * @param res - Express response object
 */
export const createFAQ = async (req: Request, res: Response) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Check if user is admin/staff
    if (!["STAFF", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    const { question, answer, category } = req.body;

    // Input validation
    if (!question || !answer || !category) {
      return res.status(400).json({
        error: "Question, answer, and category are required",
      });
    }

    if (question.length < 5 || question.length > 500) {
      return res.status(400).json({
        error: "Question must be between 5 and 500 characters",
      });
    }

    if (answer.length < 10 || answer.length > 2000) {
      return res.status(400).json({
        error: "Answer must be between 10 and 2000 characters",
      });
    }

    // Create FAQ
    const faq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.toLowerCase(),
      },
    });

    res.status(201).json({
      message: "FAQ created successfully",
      faq: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        createdAt: faq.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Create FAQ error:", error);
    res.status(500).json({
      error: "Failed to create FAQ",
    });
  }
};

/**
 * PUT /api/faqs/:id
 * Update an existing FAQ (admin only) (F009 - Customer Support Chat)
 * @param req - Express request object with FAQ ID in params and update data in body
 * @param res - Express response object
 */
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Check if user is admin/staff
    if (!["STAFF", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    const { id } = req.params;
    const { question, answer, category, isActive } = req.body;

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existingFAQ) {
      return res.status(404).json({
        error: "FAQ not found",
      });
    }

    // Input validation for provided fields
    if (
      question !== undefined &&
      (question.length < 5 || question.length > 500)
    ) {
      return res.status(400).json({
        error: "Question must be between 5 and 500 characters",
      });
    }

    if (answer !== undefined && (answer.length < 10 || answer.length > 2000)) {
      return res.status(400).json({
        error: "Answer must be between 10 and 2000 characters",
      });
    }

    // Update FAQ
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(question !== undefined && { question: question.trim() }),
        ...(answer !== undefined && { answer: answer.trim() }),
        ...(category !== undefined && { category: category.toLowerCase() }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      message: "FAQ updated successfully",
      faq: {
        id: updatedFAQ.id,
        question: updatedFAQ.question,
        answer: updatedFAQ.answer,
        category: updatedFAQ.category,
        isActive: updatedFAQ.isActive,
        updatedAt: updatedFAQ.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Update FAQ error:", error);
    res.status(500).json({
      error: "Failed to update FAQ",
    });
  }
};

/**
 * DELETE /api/faqs/:id
 * Delete an FAQ (admin only) (F009 - Customer Support Chat)
 * @param req - Express request object with FAQ ID in params
 * @param res - Express response object
 */
export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Check if user is admin/staff
    if (!["STAFF", "ADMIN"].includes(user.role)) {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    const { id } = req.params;

    // Check if FAQ exists
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return res.status(404).json({
        error: "FAQ not found",
      });
    }

    // Delete FAQ
    await prisma.fAQ.delete({
      where: { id },
    });

    res.json({
      message: "FAQ deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete FAQ error:", error);
    res.status(500).json({
      error: "Failed to delete FAQ",
    });
  }
};
