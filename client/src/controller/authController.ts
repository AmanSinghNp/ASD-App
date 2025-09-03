import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Customer } from "../model/customer";

const customers: Customer[] = [];
const SECRET = "supersecretkey";

// Store active tokens for logout
const activeTokens: string[] = [];

// SIGNUP: Create new account
export const signup = (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) return res.status(400).send("Email and password required");
  if (customers.find(u => u.email === email)) return res.status(400).send("User already exists");

  const hashed = bcrypt.hashSync(password, 10);
  const id = customers.length + 1; // simple incremental ID

  customers.push({ id, name: name || "", email, password: hashed });
  res.send("Signup successful");
};

// LOGIN: Authenticate user & return token
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const customer = customers.find(u => u.email === email);

  if (!customer || !bcrypt.compareSync(password, customer.password))
    return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ id: customer.id, email: customer.email }, SECRET, { expiresIn: "1h" });
  activeTokens.push(token); // keep track of active tokens
  res.json({ token });
};

// LOGOUT: Invalidate token
export const logout = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");

  // Remove token from active list
  const index = activeTokens.indexOf(token);
  if (index > -1) {
    activeTokens.splice(index, 1);
    return res.send("Logout successful");
  }

  res.status(400).send("Invalid token or already logged out");
};

// DELETE ACCOUNT: Remove customer by ID
export const deleteAccount = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");

  try {
    const decoded = jwt.verify(token, SECRET) as { id: number; email: string };

    // Check if token is still active
    if (!activeTokens.includes(token)) return res.status(401).send("Token expired or logged out");

    const index = customers.findIndex(c => c.id === decoded.id);
    if (index === -1) return res.status(404).send("User not found");

    customers.splice(index, 1);
    activeTokens.splice(activeTokens.indexOf(token), 1);
    res.send("Account deleted successfully");
  } catch {
    res.status(401).send("Invalid token");
  }
};
