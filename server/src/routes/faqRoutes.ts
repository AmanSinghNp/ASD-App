import express from "express";
import {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "../controllers/faqController";

const router = express.Router();

// GET /api/faqs - Get all FAQs or filter by category
router.get("/", getFAQs);

// GET /api/faqs/:id - Get specific FAQ by ID
router.get("/:id", getFAQById);

// POST /api/faqs - Create new FAQ (admin only)
router.post("/", createFAQ);

// PUT /api/faqs/:id - Update FAQ (admin only)
router.put("/:id", updateFAQ);

// DELETE /api/faqs/:id - Delete FAQ (admin only)
router.delete("/:id", deleteFAQ);

export default router;
