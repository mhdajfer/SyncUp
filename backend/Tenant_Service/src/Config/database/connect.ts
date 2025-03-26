import mongoose from "mongoose";

export const connectDB = () => {
  if (process.env.DB_URL) {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log(`Database connected for Tenant-Service`))
      .catch((err) => console.log(`Database connection error: ${err.message}`));
  }
};
