// src/server.ts

// 1️⃣ Import dependencies at the top
import express from "express";
import cors from "cors";

// 2️⃣ Create the Express app
const app = express();
const PORT = process.env.PORT || 4000;

// 3️⃣ Middleware
app.use(cors());
app.use(express.json());

// 4️⃣ Routes
app.get("/", (_, res) => {
  res.send("Welcome to the Supermarket API!");
});

// 5️⃣ Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
