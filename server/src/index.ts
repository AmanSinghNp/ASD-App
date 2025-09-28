import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
// app.use(cors());
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors({
  origin: "http://localhost:5173", // change to your React dev URL
  credentials: true, // allow cookies if needed
}));
app.use(express.json());

const SECRET = "supersecretkey";
const PORT = 3000;

// Example route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

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

// Example Express + Prisma login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).send("User not found");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).send("Incorrect password");

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  res.json({ token, message: "Login successful ✅" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
