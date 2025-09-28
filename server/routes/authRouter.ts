import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, UserRole } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "supersecretkey"; // fallback secret

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
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });

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
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful ✅", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong, please try again ❌" });
  }
});

export default router;
