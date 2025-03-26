import { Server, Socket } from "socket.io";
import { IMessage } from "../interfaces/IMessage";
import { IChat } from "../interfaces/IChat";
import { ISocketManager } from "../interfaces/ISocketManager";
import { CustomError } from "../../ErrorHandler/CustonError";

export class SocketManager implements ISocketManager {
  private _io: Server;
  private _userSocketMap = new Map<string, string>();

  constructor(_io: Server) {
    this._io = _io;
  }

  public initialize(): void {
    this._io.on("connection", (socket: Socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });

      socket.on("setup", (chatIds: string[]) => {
        for (let i = 0; i < chatIds.length; i++) {
          socket.join(chatIds[i]);
        }
      });

      socket.on("new message", (newMessage: IMessage) => {
        this.handleNewMessage(socket, newMessage);
      });

      socket.on("join room", (roomId: string) => {
        socket.join(roomId);
        console.log("User joined room:", roomId);
      });

      socket.on(
        "registerUser",
        ({ userId, socketId }: { userId: string; socketId: string }) => {
          this._userSocketMap.set(userId, socketId);
          console.log("User registered:", userId + " with socketId:", socketId);
        }
      );

      socket.on(
        "initiateCall",
        ({
          userId,
          signalData,
          myId,
        }: {
          userId: string;
          myId: string;
          signalData: any;
        }) => {
          const userSocketId = this._userSocketMap.get(userId);

          if (userSocketId) {
            this._io.to(userSocketId).emit("incomingCall", {
              from: myId,
              signalData,
            });
          }
        }
      );

      socket.on("answerCall", ({ signal, to }: { signal: any; to: string }) => {
        const userSocketId = this._userSocketMap.get(to);

        if (userSocketId) {
          this._io.to(userSocketId).emit("callAccepted", signal);
        }
      });

      socket.on(
        "endCall",
        ({
          userId,
          currentUserId,
        }: {
          userId: string;
          currentUserId: string;
        }) => {
          const userSocketId = this._userSocketMap.get(userId);

          if (userSocketId) {
            this._io.to(userSocketId).emit("callEnded");
          }
        }
      );

      socket.on("disconnect", () => {
        for (const [userId, socketId] of this._userSocketMap.entries()) {
          if (socketId === socket.id) {
            this._userSocketMap.delete(userId);
            break;
          }
        }
        console.log("User disconnected:", socket.id);
      });
    });
  }

  private handleNewMessage(socket: Socket, newMessage: IMessage): void {
    console.log("New message received.");

    const chat = newMessage.chat as IChat;
    if (!chat._id) throw new CustomError("Chat ID not found", 404);

    socket.to(chat._id).emit("message received", newMessage);
  }
}
