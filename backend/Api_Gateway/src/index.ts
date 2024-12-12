import express, { NextFunction, Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes";
import projectRouter from "./routes/project.routes";
import tenantRouter from "./routes/tenants.routes";
import cookieParser from "cookie-parser";
import commRouter from "./routes/chat.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/projects", projectRouter);
app.use("/tenants", tenantRouter);
app.use("/comm", commRouter);

app.listen(port, () => {
  console.log(`api-gateway started on ${port}`);
});
