import express from "express";
import { authController } from "../controllers/authController";

const router = express.Router();
const auth = new authController();

// Auth endpoints
router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.delete("/delete", auth.deleteAccount);

export default router;
