import express from "express";
import authRouter from "../routes/authRouter";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

export default app; // important for Supertest
