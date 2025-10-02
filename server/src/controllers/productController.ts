import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/products?includeHidden=false
export const getProducts = async (req: Request, res: Response) => {
  try {
    const includeHidden = req.query.includeHidden === "true";
    
    const products = await prisma.product.findMany({
      where: includeHidden ? {} : { isActive: true },
      orderBy: { createdAt: "desc" }
    });

    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, category, priceCents, stockQty, imageUrl } = req.body;

    // Validation
    if (!name || name.length < 1 || name.length > 120) {
      return res.status(400).json({ error: "Name must be 1-120 characters" });
    }
    if (typeof priceCents !== "number" || priceCents < 0 || !Number.isInteger(priceCents)) {
      return res.status(400).json({ error: "priceCents must be a non-negative integer" });
    }
    if (typeof stockQty !== "number" || stockQty < 0 || !Number.isInteger(stockQty)) {
      return res.status(400).json({ error: "stockQty must be a non-negative integer" });
    }

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        priceCents,
        stockQty,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({ data: product });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "SKU already exists" });
    } else {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sku, name, category, priceCents, stockQty, imageUrl } = req.body;

    // Validation for provided fields
    if (name !== undefined && (name.length < 1 || name.length > 120)) {
      return res.status(400).json({ error: "Name must be 1-120 characters" });
    }
    if (priceCents !== undefined && (typeof priceCents !== "number" || priceCents < 0 || !Number.isInteger(priceCents))) {
      return res.status(400).json({ error: "priceCents must be a non-negative integer" });
    }
    if (stockQty !== undefined && (typeof stockQty !== "number" || stockQty < 0 || !Number.isInteger(stockQty))) {
      return res.status(400).json({ error: "stockQty must be a non-negative integer" });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(sku !== undefined && { sku }),
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(priceCents !== undefined && { priceCents }),
        ...(stockQty !== undefined && { stockQty }),
        ...(imageUrl !== undefined && { imageUrl })
      }
    });

    res.json({ data: product });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
    } else if (error.code === "P2002") {
      res.status(400).json({ error: "SKU already exists" });
    } else {
      res.status(500).json({ error: "Failed to update product" });
    }
  }
};

// PATCH /api/products/:id/hide
export const hideProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ data: product });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Failed to hide product" });
    }
  }
};

