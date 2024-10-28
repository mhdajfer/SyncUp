import mongoose from "mongoose";
import { CustomError } from "../../ErrorHandler/CustonError";

export const connectDB = () => {
  if (process.env.DB_URL) {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log(`Database connected for Project-Service`))
      .catch((err) => console.log(`Database connection error: ${err.message}`));
  }
};
