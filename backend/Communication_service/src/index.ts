import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./Shared/Utils/SocketManager";
import app from "./app";

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

const socketManager = new SocketManager(io);
socketManager.initialize();

httpServer.listen(Port, () => {
  console.log(`Communication server started on ${Port}`);
});
