// server/src/app.ts
import express from "express";
import cors from "cors";
import authRouter from "../routes/authRouter"; // your auth routes

const app = express();

// ===== Middleware =====
// Enable CORS for your React frontend
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // only needed if using cookies
}));

// Parse JSON bodies
app.use(express.json());

// ===== Routes =====
app.use("/auth", authRouter);

// Optional test route
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

export default app;
