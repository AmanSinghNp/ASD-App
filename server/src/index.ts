import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import app from "./app"
import authRouter from "../routes/authRouter.ts"; // import auth routes

dotenv.config();

// const app = express();
const PORT = 3000; // your backend port
// export default app;

// Enable CORS for your React frontend
app.use(cors({
  origin: "http://localhost:5173", // change if using CRA: http://localhost:3000
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Mount auth routes under /auth
app.use("/auth", authRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
