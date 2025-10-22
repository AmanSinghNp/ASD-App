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
import authRouter from "./routes/authRouter";

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Use the port from environment variables, with a fallback to 4000
const PORT = process.env.PORT || 4000;

// --- Middleware Setup ---
const allowedOriginsFromEnv = process.env.ALLOWED_ORIGINS?.split(",").map(s => s.trim()).filter(Boolean) || [];
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
];
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...allowedOriginsFromEnv])];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

// --- Routes Setup ---

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
app.use("/api/auth", authRouter);

// Health check route
app.get("/", (_, res) => {
  res.send("Welcome to the Supermarket API!");
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Export the prisma instance so it can be used in your route files
export { prisma };
