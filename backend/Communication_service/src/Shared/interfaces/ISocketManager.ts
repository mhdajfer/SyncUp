import { Server, Socket } from "socket.io";

export interface ISocketManager {
  initialize(io: Server): void;
}
