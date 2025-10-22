// src/server.ts

// Import dependencies at the top
import express from "express";
import cors from "cors";

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

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
