import express from "express";
import { getProducts, createProduct, updateProduct, hideProduct } from "../controllers/productController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = express.Router();

// GET /api/products?includeHidden=false - Public access
router.get("/", getProducts);

// POST /api/products - Admin only
router.post("/", requireAuth, requireAdmin, createProduct);

// PUT /api/products/:id - Admin only
router.put("/:id", requireAuth, requireAdmin, updateProduct);

// PATCH /api/products/:id/hide - Admin only
router.patch("/:id/hide", requireAuth, requireAdmin, hideProduct);

export default router;

