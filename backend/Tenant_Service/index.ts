import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tenantAdminRoutes from "./src/routes/tenantRouter";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/frameworks/mongo/connect";
import { errorHandler } from "./src/ErrorHandler/ErrorHandler";
import { connectConsumers } from "./src/events/Consumers";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

connectConsumers();

app.use("/tenants", tenantAdminRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Tenant server started on ${port}`);
});
