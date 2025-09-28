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
const PORT = 3000;

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
      role
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

  return res.json({ message: "Signup successful ✅", token });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
