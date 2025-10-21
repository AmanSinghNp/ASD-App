import type { Request, Response } from "express";
import { CustomerModel } from "../models/customer";

export class authController{
  private model: CustomerModel;

  constructor(){
    this.model = new CustomerModel();
  }

  signup = (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
      const msg = this.model.signup(email, password, name);
      res.send(msg);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  login = (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const token = this.model.login(email, password);
      res.json({ token });
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  logout = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("No token provided");

    try {
      const msg = this.model.logout(token);
      res.send(msg);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  deleteAccount = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("No token provided");

    try {
      const msg = this.model.deleteAccount(token);
      res.send(msg);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };
}

