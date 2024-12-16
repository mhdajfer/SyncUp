import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import tenantAdminRoutes from "./routes/tenantRouter";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { requestLogger } from "./middlewares/requestLogger";

export const createApp = (): express.Application => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use("/tenants", tenantAdminRoutes);

  app.use(errorHandler);

  return app;
};
