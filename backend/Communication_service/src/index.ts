import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Utils/SocketManager";
import app from "./app";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGIN,
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

const Port = process.env.PORT;

const socketManager = new SocketManager(io);
socketManager.initialize();

httpServer.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
