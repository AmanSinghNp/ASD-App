import express from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = express.Router();

// GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD - Admin only
router.get("/", requireAuth, requireAdmin, getAnalytics);

export default router;

