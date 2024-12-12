import express from "express";
import dotenv from "dotenv";
import { connectConsumers } from "./src/events/Consumers";
import { connectDB } from "./src/frameworks/mongo/connect";
import CommunicationRoutes from "./src/routes/index";
import { Server } from "socket.io";
import { createServer } from "http";
import { SocketManager } from "./src/Utils/SocketManager";
import { errorHandler } from "./src/ErrorHandler/ErrorHandler";
import { requestLogger } from "./src/Middlewares/requestLogger";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

const Port = process.env.PORT;

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectConsumers();

connectDB();

app.use("/chats", CommunicationRoutes);

app.use(errorHandler);

const socketManager = new SocketManager(io);
socketManager.initialize();

httpServer.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
