import dotenv from "dotenv";
import { createApp } from "./app";
import { connectDB } from "./Frameworks/mongo/connect";
import { connectConsumers } from "./events/Consumers";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else {
  console.warn("NODE_ENV is not set. Using default environment.");
  dotenv.config();
}

const port = process.env.PORT;

(async () => {
  try {
    connectDB();

    connectConsumers();

    const app = createApp();

    app.listen(port, () => {
      console.log(`User server started on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
