import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tenantAdminRoutes from "./routes/tenantRouter";
import cookieParser from "cookie-parser";
import { connectDB } from "./frameworks/mongo/connect";
import { errorHandler } from "./ErrorHandler/ErrorHandler";
import { connectConsumers } from "./events/Consumers";
import { requestLogger } from "./middlewares/requestLogger";

const app = express();
dotenv.config();

const port = process.env.PORT || 3005;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

connectDB();

// connectConsumers();

app.use("/tenants", tenantAdminRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Tenant server started on ${port}`);
});
