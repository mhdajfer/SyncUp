import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { requestLogger } from "./Middlewares/requestLogger";

export const createApp = (): express.Application => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Routes
  app.use("/users", userRoute);

  // Error handler
  app.use(errorHandler);

  return app;
};
