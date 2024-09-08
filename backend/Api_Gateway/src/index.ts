import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/users");

app.listen(port, () => {
  console.log(`api-gateway started on ${port}`);
});
