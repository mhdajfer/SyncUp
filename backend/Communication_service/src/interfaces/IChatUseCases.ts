import { ICall } from "./index";
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
  createCallRecord(data: ICall, userId: string): Promise<ICall[]>;
  getCallHistory(userId: string): Promise<ICall[]>;
  updateCallRecord(userId: string): Promise<ICall[]>;
}
