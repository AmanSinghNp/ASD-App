import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  getUserOrders,
} from "../controllers/userController";

const router = express.Router();

// POST /api/users/signup - Create new user account
router.post("/signup", signup);

// POST /api/users/login - Authenticate user
router.post("/login", login);

// GET /api/users/profile - Get user profile (requires auth)
router.get("/profile", getProfile);

// PUT /api/users/profile - Update user profile (requires auth)
router.put("/profile", updateProfile);

// DELETE /api/users/account - Delete user account (requires auth)
router.delete("/account", deleteAccount);

// GET /api/users/orders - Get user's order history (requires auth)
router.get("/orders", getUserOrders);

export default router;
