import express from "express";
import dotenv from "dotenv";
import { connectConsumers } from "./src/events/Consumers";
import { sendMail } from "./src/Utils/nodeMailer";

const app = express();

const Port = process.env.PORT || 3004;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectConsumers();

// app.post("/aa", async () => {
//   console.log("kjhkjhk");

//   sendMail("justinjose5134@gmail.com", "otp", "verifiction");
// });

app.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
