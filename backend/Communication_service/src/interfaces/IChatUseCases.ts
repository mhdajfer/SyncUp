import { IChat } from "./IChat";
import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChatUseCases {
  getAllUsers(): Promise<IUser[]>;
  getChat(userId1: string, userId2: string): Promise<IChat>;
  getAllChats(userId: string): Promise<IChat[]>;
  sendMessage(
    senderId: string,
    content: string,
    chatId: string,
    file?: boolean
  ): Promise<IMessage>;
  getMessages(chatId: string): Promise<IMessage[]>;
}
