// src/server.ts

// Import dependencies at the top
import express from "express";
import cors from "cors";

//import prismaclient 
import { PrismaClient } from '@prisma/client'; 

// Create the Express app
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());


app.get("/api/products", async (req, res) => {
  // New api entry point to fetch products with optional filtering and sorting
  const { search, category, sortBy, order } = req.query;
  
  try {
    const products = await prisma.product.findMany({
      where: {
        // Build database query conditions based on query parameters
        name: {
          contains: typeof search === 'string' ? search : undefined,
        },
        category: typeof category === 'string' ? category : undefined,
      },
      orderBy: {
        [typeof sortBy === 'string' ? sortBy : 'name']: typeof order === 'string' ? order : 'asc',
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Routes
app.get("/", (_, res) => {
  res.send("Welcome to the Supermarket API!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
