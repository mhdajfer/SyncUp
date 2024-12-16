import express from "express";
import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

const port = process.env.PORT;

(async () => {
  const app = createApp();

  app.listen(port, () => {
    console.log(`User server started on port ${port}`);
  });
})();
