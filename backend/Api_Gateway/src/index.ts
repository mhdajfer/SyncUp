import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`api-gateway started on ${port}`);
});
