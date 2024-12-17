import express from "express";
import { connectConsumers } from "./events/Consumers";
import { connectDB } from "./frameworks/mongo/connect";
import CommunicationRoutes from "./routes/index";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { requestLogger } from "./Middlewares/requestLogger";
import dotenv from "dotenv";

const app = express();

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else {
  console.warn("NODE_ENV is not set. Using default environment.");
  dotenv.config();
}

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectConsumers();

connectDB();

app.use("/chats", CommunicationRoutes);

app.use(errorHandler);

export default app;
