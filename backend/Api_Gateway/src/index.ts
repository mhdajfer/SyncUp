import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/Auth.routes";
import { connectDB } from "./Framework/mongo/connect";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/users", userRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/", authRouter);

app.listen(port, () => {
  console.log(`api-gateway started on ${port}`);
});
