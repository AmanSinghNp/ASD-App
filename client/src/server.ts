import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRouter";

const app = express();
app.use(bodyParser.json());

// Use /api/auth for all auth-related endpoints
app.use("/api/auth", authRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
