import dotenv from "dotenv";
import { createApp } from "./app";
import { connectDB } from "./frameworks/mongo/connect";
import { connectConsumers } from "./events/Consumers";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else {
  console.warn("NODE_ENV is not set. Using default environment.");
  dotenv.config();
}

console.log(
  process.env.NODE_ENV?.toString() === "development"
    ? "dev"
    : process.env.NODE_ENV?.toString() === "production"
    ? "prod"
    : "nil"
);

const port = process.env.PORT;

(async () => {
  try {
    connectDB();

    connectConsumers();

    const app = createApp();

    app.listen(port, () => {
      console.log(`latest User server started on port ${port}`);
      console.log(`${process.env.AWS_S3_BUCKET_NAME}`);
      console.log(`${process.env.AWS_SECRET_ACCESS_KEY}`);
      console.log(`${process.env.AWS_S3_REGION}`);
      console.log(`${process.env.AWS_ACCESS_KEY}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
