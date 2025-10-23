// server/src/index.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
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

// Use the port from environment variables, with a fallback to 3000
const PORT = process.env.PORT || 3000;

// --- Middleware Setup ---
// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://asd-app-aman2025.azurewebsites.net', 'https://asd-app-aman2025.azurewebsites.net/']
    : 'http://localhost:5173',
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle all OPTIONS requests
app.options('*', cors(corsOptions));

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

// Serve static files from client/dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  // Handle React routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
} else {
  // Health check route for development
  app.get("/", (_, res) => {
    res.send("Welcome to the Supermarket API!");
  });
}

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Export the prisma instance so it can be used in your route files
export { prisma };
