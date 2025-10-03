// server/src/index.ts
import dotenv from "dotenv";
import app from "./app.ts";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import deliveryRoutes from "./routes/deliveryRoutes";
import orderRoutes from "./routes/orderRoutes";
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health route
app.get("/", (_, res) => {
  res.send("Welcome to the Supermarket API!");
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
