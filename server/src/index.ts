// server/src/index.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'; 

// Import your route handlers
import productRoutes from "./routes/productRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import orderRoutes from "./routes/orderRoutes";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create the Express app
const app = express();

// Use the port from environment variables, with a fallback to 3000
const PORT = process.env.PORT || 3000;

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- Routes Setup ---

// Health check route
app.get("/", (_, res) => {
  res.send("Welcome to the Supermarket API!");
});

// API Routes
// This uses the dedicated route files, which is a better practice.
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Export the prisma instance so it can be used in your route files
export { prisma };