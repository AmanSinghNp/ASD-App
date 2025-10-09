import express from "express";
import { getAnalytics } from "../controllers/analyticsController";

const router = express.Router();

// GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", getAnalytics);

export default router;

