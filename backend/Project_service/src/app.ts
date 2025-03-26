import express from "express";
import cors from "cors";
import projectRoutes from "./Interface/Routes/project-routes";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { requestLogger } from "./Interface/Middlewares/requestLogger";

export const createApp = (): express.Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use("/projects", projectRoutes);

  app.use(errorHandler);

  return app;
};
