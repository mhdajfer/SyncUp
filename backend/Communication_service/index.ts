import express from "express";
import dotenv from "dotenv";
import { connectConsumers } from "./src/events/Consumers";
dotenv.config();

const app = express();

const Port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connectConsumers();

app.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
