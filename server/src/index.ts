// src/server.ts

// Import dependencies at the top
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import orderRoutes from "./routes/orderRoutes";

// Create the Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_, res) => {
  res.send("Welcome to the Supermarket API!");
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
