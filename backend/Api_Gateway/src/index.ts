import dotenv from "dotenv";
import { createApp } from "./app";

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
  const app = createApp();

  app.listen(port, () => {
    console.log(`User server started on port ${port}`);
  });
})();
