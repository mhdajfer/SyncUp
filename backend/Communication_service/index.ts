import express from "express";
import dotenv from "dotenv";
import { connectConsumers } from "./src/events/Consumers";
const morgan = require("morgan");
import { connectDB } from "./src/frameworks/mongo/connect";
dotenv.config();

const app = express();

const Port = process.env.PORT;

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectConsumers();

connectDB();

app.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
