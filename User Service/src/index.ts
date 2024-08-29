import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.routes";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`User server started on ${port}`);
});
