import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import projectRouter from "./routes/project.routes";
import tenantRouter from "./routes/tenants.routes";
import cookieParser from "cookie-parser";
import commRouter from "./routes/chat.routes";

export const createApp = (): express.Application => {
  const app = express();

  const corsOptions = {
    origin: "http://localhost:31088", // Single origin
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.use((req, res, next) => {
    console.log("gor request");
    next();
  });

  app.use("/users", userRouter);
  app.use("/projects", projectRouter);
  app.use("/tenants", tenantRouter);
  app.use("/comm", commRouter);

  return app;
};
