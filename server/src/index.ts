import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey";

app.post("/signup", async (req, res) => {
  const { name, email, passwordHash, role } = req.body;

  if (!email || !passwordHash || !name) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(passwordHash, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role
    },
  });

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

  return res.json({ message: "Signup successful ✅", token });
});
