// controllers/authController.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Customer } from "../model/customer";

const customers: Customer[] = [];
const SECRET = "supersecretkey";

export const signup = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (customers.find(u => u.email === email)) return res.status(400).send("User exists");
  const hashed = bcrypt.hashSync(password, 10);
  customers.push({
      email, password: hashed,
      id: 0,
      name: ""
  });
  res.send("Signup successful");
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const customer = customers.find(u => u.email === email);
  if (!customer || !bcrypt.compareSync(password, customer.password))
    return res.status(400).send("Invalid credentials");
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
};
