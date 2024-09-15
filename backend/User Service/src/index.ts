import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/user.routes";
import { connectDB } from "./frameworks/mongo/connect";

const app = express();
dotenv.config();

const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`User server started on ${port}`);
});
