import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { requestLogger } from "./Middlewares/requestLogger";

export const createApp = (): express.Application => {
  const app = express();

  const mid = (req: Request, res: Response, next: NextFunction) => {
    console.log("got request", req.body);
    next();
  };

  // Middlewares
  // const corsOptions = {
  //   origin: process.env.CORS_ORIGIN || "https://syncup.mhdajfer.in",
  //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  //   credentials: true, // If cookies or Authorization headers are used
  // };

  app.use(cors());

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Routes
  app.use("/users", mid, userRoute);

  // Error handler
  app.use(errorHandler);

  return app;
};
