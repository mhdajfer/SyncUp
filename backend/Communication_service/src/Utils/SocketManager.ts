import { Server, Socket } from "socket.io";
import { IMessage } from "../interfaces/IMessage";
import { IChat } from "../interfaces/IChat";
import { IUser } from "../interfaces/IUser";
import { ISocketManager } from "../interfaces/ISocketManager";

export class SocketManager implements ISocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public initialize(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });

      socket.on("setup", (id: string) => {
        socket.join(id);
        console.log("User connected to room:", id);
      });

      socket.on("join room", (roomId: string) => {
        socket.join(roomId);
        console.log("User joined room:", roomId);
      });

      socket.on("new message", (newMessage: IMessage) => {
        this.handleNewMessage(socket, newMessage);
      });
    });
  }

  private handleNewMessage(socket: Socket, newMessage: IMessage): void {
    console.log("New message received:", newMessage);

    const chat = newMessage.chat as IChat;

    if (chat.users.length === 0) {
      console.log("No users found in chat");
      return;
    }

    chat.users.forEach((user: IUser) => {
      const sender = newMessage.sender as IUser;

      if (!user._id || user._id === sender._id) return;

      socket.to(user._id).emit("message received", newMessage);
    });
  }
}
