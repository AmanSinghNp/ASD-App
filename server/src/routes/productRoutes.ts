import express from "express";
import { getProducts, createProduct, updateProduct, hideProduct } from "../controllers/productController";

const router = express.Router();

// GET /api/products?includeHidden=false
router.get("/", getProducts);

// POST /api/products
router.post("/", createProduct);

// PUT /api/products/:id
router.put("/:id", updateProduct);

// PATCH /api/products/:id/hide
router.patch("/:id/hide", hideProduct);

export default router;

