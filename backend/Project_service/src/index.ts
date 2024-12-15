import express from "express";
import cors from "cors";
import projectRoutes from "./Routes/project-routes";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { connectDB } from "./Frameworks/mongo/connect";
import { connectConsumers } from "./events/Consumers";
import { requestLogger } from "./Middlewares/requestLogger";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

connectDB();

// connectConsumers();

app.use("/projects", projectRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Project server started on ${port}`);
});
