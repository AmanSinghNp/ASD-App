import type { Request, Response } from "express";
import prisma from "../utils/database";

// POST /api/delivery/validate-address
export const validateAddress = async (req: Request, res: Response) => {
  try {
    const { addressLine1, suburb, state, postcode } = req.body;

    // Validation rules
    if (!postcode || !/^\d{4}$/.test(postcode)) {
      return res.json({ valid: false, error: "Postcode must be 4 digits" });
    }

    const validStates = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
    if (!state || !validStates.includes(state)) {
      return res.json({ valid: false, error: "Invalid state" });
    }

    if (!addressLine1 || !suburb) {
      return res.json({
        valid: false,
        error: "Address line 1 and suburb required",
      });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to validate address" });
  }
};

// GET /api/delivery/slots?date=YYYY-MM-DD
export const getDeliverySlots = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date parameter required" });
    }

    const targetDate = new Date(date as string);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Generate 8 hourly slots (10:00-18:00)
    const slots = [];
    for (let hour = 10; hour <= 17; hour++) {
      const slotStart = new Date(targetDate);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(targetDate);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Count existing orders in this slot
      const orderCount = await prisma.order.count({
        where: {
          slotStart: {
            gte: slotStart,
            lt: slotEnd,
          },
        },
      });

      const remaining = Math.max(0, 10 - orderCount);

      slots.push({
        slotStart: slotStart.toISOString(),
        slotEnd: slotEnd.toISOString(),
        remaining,
      });
    }

    res.json({ data: slots });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch delivery slots" });
  }
};
