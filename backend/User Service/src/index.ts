import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.routes";
import cookieParser from "cookie-parser";
import { connectDB } from "./frameworks/mongo/connect";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { connectConsumers } from "./events/Consumers";
import { requestLogger } from "./Middlewares/requestLogger";
dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

connectDB();

connectConsumers();

app.use("/users", userRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`User server started on ${port}`);
});
