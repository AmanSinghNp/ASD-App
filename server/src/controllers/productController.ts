/**
 * Product Management Controller
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Handles product CRUD operations, validation, and admin product management
 * Last Updated: 2025-10-22
 */

import type { Request, Response } from "express";
import prisma from "../utils/database";
import { cache } from "../utils/cache";

/**
 * GET /api/products?includeHidden=false
 * Retrieve all products with optional hidden products inclusion
 * @param req - Express request object with optional includeHidden query parameter
 * @param res - Express response object
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const includeHidden = req.query.includeHidden === "true";

    // Fetch products from database with conditional filtering
    const products = await prisma.product.findMany({
      where: includeHidden ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * POST /api/products
 * Create a new product in the database
 * @param req - Express request object with product data in body
 * @param res - Express response object
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, category, priceCents, stockQty, imageUrl } = req.body;

    // Input validation
    if (!name || name.length < 1 || name.length > 120) {
      return res.status(400).json({ error: "Name must be 1-120 characters" });
    }
    if (
      typeof priceCents !== "number" ||
      priceCents < 0 ||
      !Number.isInteger(priceCents)
    ) {
      return res
        .status(400)
        .json({ error: "priceCents must be a non-negative integer" });
    }
    if (
      typeof stockQty !== "number" ||
      stockQty < 0 ||
      !Number.isInteger(stockQty)
    ) {
      return res
        .status(400)
        .json({ error: "stockQty must be a non-negative integer" });
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        id: sku, // Use SKU as ID for consistency
        sku,
        name,
        category,
        priceCents,
        stockQty,
        imageUrl: imageUrl || null,
      },
    });

    // Clear analytics cache when products are modified
    cache.clear();

    res.status(201).json({ data: product });
  } catch (error: any) {
    // Handle unique constraint violations (duplicate SKU)
    if (error.code === "P2002") {
      res.status(400).json({ error: "SKU already exists" });
    } else {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
};

/**
 * PUT /api/products/:id
 * Update an existing product by ID
 * @param req - Express request object with product ID in params and update data in body
 * @param res - Express response object
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sku, name, category, priceCents, stockQty, imageUrl } = req.body;

    // Validate provided fields (only validate fields that are being updated)
    if (name !== undefined && (name.length < 1 || name.length > 120)) {
      return res.status(400).json({ error: "Name must be 1-120 characters" });
    }
    if (
      priceCents !== undefined &&
      (typeof priceCents !== "number" ||
        priceCents < 0 ||
        !Number.isInteger(priceCents))
    ) {
      return res
        .status(400)
        .json({ error: "priceCents must be a non-negative integer" });
    }
    if (
      stockQty !== undefined &&
      (typeof stockQty !== "number" ||
        stockQty < 0 ||
        !Number.isInteger(stockQty))
    ) {
      return res
        .status(400)
        .json({ error: "stockQty must be a non-negative integer" });
    }

    // Update product in database with only provided fields
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(sku !== undefined && { sku }),
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(priceCents !== undefined && { priceCents }),
        ...(stockQty !== undefined && { stockQty }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    // Clear analytics cache when products are modified
    cache.clear();

    res.json({ data: product });
  } catch (error: any) {
    // Handle different error types
    if (error.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
    } else if (error.code === "P2002") {
      res.status(400).json({ error: "SKU already exists" });
    } else {
      res.status(500).json({ error: "Failed to update product" });
    }
  }
};

/**
 * PATCH /api/products/:id/hide
 * Hide/deactivate a product by setting isActive to false
 * @param req - Express request object with product ID in params
 * @param res - Express response object
 */
export const hideProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Update product to set isActive to false
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    // Clear analytics cache when products are modified
    cache.clear();

    res.json({ data: product });
  } catch (error: any) {
    // Handle product not found error
    if (error.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Failed to hide product" });
    }
  }
};
