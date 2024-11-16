import express from "express";
import dotenv from "dotenv";
import { connectConsumers } from "./src/events/Consumers";
const morgan = require("morgan");
import { connectDB } from "./src/frameworks/mongo/connect";
import chatRoutes from "./src/routes/chatRoutes";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { SocketManager } from "./src/Utils/SocketManager";

import { errorHandler } from "./src/ErrorHandler/ErrorHandler";
import { IMessage } from "./src/interfaces/IMessage";
import { IChat } from "./src/interfaces/IChat";
import { IUser } from "./src/interfaces/IUser";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Update this to match your frontend origin
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

const Port = process.env.PORT;

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connectConsumers();

connectDB();

app.use("/chats", chatRoutes);

app.use(errorHandler);

const socketManager = new SocketManager(io);
socketManager.initialize();

httpServer.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
