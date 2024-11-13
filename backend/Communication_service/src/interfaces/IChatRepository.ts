import { IChat } from "./IChat";
import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChatRepository {
  getAllUsers(): Promise<IUser[]>;
  getChat(userId1: string, userId2: string): Promise<IChat>;
  createChat(userId1: string, userId2: string): Promise<IChat>;
  getChatsByUserId(userId: string): Promise<IChat[]>;
  sendMessage(
    senderId: string,
    chatId: string,
    content: string
  ): Promise<IMessage>;
  getMessages(chatId: string): Promise<IMessage[]>;
}
