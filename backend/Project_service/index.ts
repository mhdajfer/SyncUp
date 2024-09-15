import express from "express";
import cors from "cors";
import projectRoutes from "./src/Routes/project-routes";
import { connectDB } from "./src/Frameworks/mongo/connect";

const app = express();

const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/projects", projectRoutes);

app.listen(port, () => {
  console.log(`User server started on ${port}`);
});
