import { ICall } from "./index";
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
    content: string,
    file?: boolean
  ): Promise<IMessage>;
  getMessages(chatId: string): Promise<IMessage[]>;
  createCallRecord(data: ICall, userId: string): Promise<ICall[]>;
  getCallHistory(userId: string): Promise<ICall[]>;
  updateCallRecord(userId: string): Promise<ICall[]>;
}
