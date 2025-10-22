// server/src/index.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import prisma from "./utils/database";

// Import your route handlers
import productRoutes from "./routes/productRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import stockRoutes from "./routes/stockRoutes";
import faqRoutes from "./routes/faqRoutes";
import chatRoutes from "./routes/chatRoutes";

// Load environment variables
dotenv.config();

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

// Health check endpoint for production monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/chat", chatRoutes);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Export the prisma instance so it can be used in your route files
export { prisma };
