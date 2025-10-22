import express from "express";
import { validateAddress, getDeliverySlots } from "../controllers/deliveryController";

const router = express.Router();

// POST /api/delivery/validate-address
router.post("/validate-address", validateAddress);

// GET /api/delivery/slots?date=YYYY-MM-DD
router.get("/slots", getDeliverySlots);

export default router;

