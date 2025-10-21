import express from "express";
import {
  getStockHistory,
  updateStock,
  checkStockAvailability,
  getLowStockProducts,
} from "../controllers/stockController";

const router = express.Router();

// GET /api/stock/:productId/history - Get stock change history for product
router.get("/:productId/history", getStockHistory);

// PUT /api/stock/:productId - Update stock quantity (requires auth)
router.put("/:productId", updateStock);

// GET /api/stock/low-stock - Get products with low stock levels
router.get("/low-stock", getLowStockProducts);

// POST /api/stock/check-availability - Check stock availability for multiple products
router.post("/check-availability", checkStockAvailability);

export default router;
