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
  const { search, category, sortBy, order } = req.query;

  // Define a type for the where clause to ensure type safety
  type WhereClause = {
    name?: {
      contains: string;
    };
    category?: string;
  };

  try {
    // 1. Start with an empty 'where' object
    const where: WhereClause = {};

    // 2. Only add filters if the query parameters are valid strings
    if (typeof search === 'string' && search.length > 0) {
      where.name = {
        contains: search,
      };
    }

    if (typeof category === 'string' && category.length > 0) {
      where.category = category;
    }

    // 3. Use the dynamically built 'where' object in your query
    const products = await prisma.product.findMany({
      where: where, // Use the new object here
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
