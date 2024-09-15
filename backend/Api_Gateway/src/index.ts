import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/Auth.routes";
import projectRouter from "./routes/project.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/projects", projectRouter);

app.listen(port, () => {
  console.log(`api-gateway started on ${port}`);
});
