import { Server, Socket } from "socket.io";
import { IMessage } from "../interfaces/IMessage";
import { IChat } from "../interfaces/IChat";
import { IUser } from "../interfaces/IUser";
import { ISocketManager } from "../interfaces/ISocketManager";

export class SocketManager implements ISocketManager {
  private _io: Server;

  constructor(_io: Server) {
    this._io = _io;
  }

  public initialize(): void {
    this._io.on("connection", (socket: Socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });

      socket.on(
        "registerUser",
        ({ userId, socketId }: { userId: string; socketId: string }) => {
          console.log(`Registering user: ${userId}, Socket ID: ${socketId}`);
          socket.join(userId);
        }
      );

      socket.on("setup", (id: string) => {
        socket.join(id);
        console.log("User connected to room:", id);
      });

      socket.on("join room", (roomId: string) => {
        socket.join(roomId);
        console.log("User joined room:", roomId);
      });
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
          console.log("video call initiated***********************", userId);
          socket.to(userId).emit("incomingCall", { signalData, from: myId });
        }
      );

      socket.on("answerCall", (data: any) => {
        socket.to(data.to).emit("callAccepted", data.signal);
      });

<<<<<<< Updated upstream
      socket.on("endCall", ({ to }: { to: any }) => {
=======
<<<<<<< Updated upstream
      socket.on("endCall", ({ to }) => {
>>>>>>> Stashed changes
        socket.to(to).emit("callEnded");
      });
=======
      socket.on(
        "endCall",
        ({
          userId,
          currentUserId,
        }: {
          userId: string;
          currentUserId: string;
        }) => {
          console.log(userId, currentUserId)
          socket.to(userId).emit("callEnded");
          socket.to(currentUserId).emit("callEnded");
        }
      );
>>>>>>> Stashed changes

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
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
