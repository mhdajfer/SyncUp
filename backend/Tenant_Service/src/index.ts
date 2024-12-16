import dotenv from "dotenv";
import { createApp } from "./app";
import { connectDB } from "./frameworks/mongo/connect";
import { connectConsumers } from "./events/Consumers";

dotenv.config();

const port = process.env.PORT || 3000;

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
