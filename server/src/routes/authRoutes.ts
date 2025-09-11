import express from "express";
import { signup, login, logout, deleteAccount } from "../controller/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", deleteAccount);

export default router;
