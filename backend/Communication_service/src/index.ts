import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Utils/SocketManager";
import app from "./app";
import { ChatRepository } from "./repositories";
import { ChatUseCases } from "./use-cases";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://syncup.mhdajfer.in",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
  path: "/comm/socket.io",
});

const Port = process.env.PORT;

const chatRepository = new ChatRepository();
const chatUseCases = new ChatUseCases(chatRepository);
const socketManager = new SocketManager(io, chatUseCases);
socketManager.initialize();

httpServer.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
