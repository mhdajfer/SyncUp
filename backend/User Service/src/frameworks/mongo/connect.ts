import mongoose from "mongoose";

const DB_URL =
  process.env.DB_URL ||
  "mongodb+srv://ajferaju9961:Achuaju6@cluster.p3idumj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster/syncUp";

export const connectDB = () => {
  mongoose
    .connect(DB_URL)
    .then(() => console.log(`Database connected for User-Service`))
    .catch((err) => console.log(`Database connection error: ${err.message}`));
};
