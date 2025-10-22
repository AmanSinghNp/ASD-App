import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // load .env

const router = express.Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'dev-secret'; // dev fallback

// ===== SIGNUP ROUTE =====
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB with role "user"
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "CUSTOMER" // default role
      },
    });

    // Create JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Signup successful ✅", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Something went wrong, please try again ❌" });
  }
});

// ===== LOGIN ROUTE =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "User not found ❌" });

    // Verify password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Incorrect password ❌" });

    // Create JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful ✅", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong, please try again ❌" });
  }
});

// ===== PROFILE ROUTE =====
router.route("/profile")
  // Fetch user profile
  .get(async (req, res) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, SECRET) as { id: string; role: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true },
        });

        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
      } catch (err) {
        console.error("JWT error:", err);
        res.status(401).json({ error: "Invalid token" });
      }
  })

  // Update user profile
  .put(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    try {
      const decoded = jwt.verify(token, SECRET) as { id: string; role: string };

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: { name, email },
        select: { id: true, name: true, email: true, role: true},
      });

      // generate new JWT
      const newToken = jwt.sign(
        { id: updatedUser.id, role: updatedUser.role },
        SECRET,
        { expiresIn: "1h" }
      );

      res.json({updatedUser, token: newToken});
    } catch (err) {
      console.error("JWT error:", err);
      res.status(401).json({ error: "Invalid token" });
    }
});

// ===== DELETE ROUTE =====
router.delete("/delete", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };

    // Delete user from database
    await prisma.user.delete({
      where: { id: decoded.id },
    });

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(401).json({ error: "Invalid token or failed to delete user" });
  }
});


export default router;
