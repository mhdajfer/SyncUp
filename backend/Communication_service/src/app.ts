import express from "express";
import dotenv from "dotenv";
import { connectConsumers } from "./events/Consumers";
import { connectDB } from "./frameworks/mongo/connect";
import CommunicationRoutes from "./routes/index";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { requestLogger } from "./Middlewares/requestLogger";

dotenv.config();

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectConsumers();

connectDB();

app.use("/chats", CommunicationRoutes);

app.use(errorHandler);

export default app;
