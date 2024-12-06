import { CustomError } from "../ErrorHandler/CustonError";
import { IChat } from "../interfaces/IChat";
import { IChatRepository } from "../interfaces/IChatRepository";
import { IChatUseCases } from "../interfaces/IChatUseCases";
import { IMessage } from "../interfaces/IMessage";
import { IUser } from "../interfaces/IUser";

export class ChateUseCases implements IChatUseCases {
  constructor(private _chatRepository: IChatRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this._chatRepository.getAllUsers();

      return users;
    } catch (error) {
      throw error;
    }
  }
  async getChat(userId1: string, userId2: string): Promise<IChat> {
    try {
      let chat = await this._chatRepository.getChat(userId1, userId2);

      if (!chat) await this._chatRepository.createChat(userId1, userId2);

      chat = await this._chatRepository.getChat(userId1, userId2);

      return chat;
    } catch (error) {
      throw error;
    }
  }

  async getAllChats(userId: string): Promise<IChat[]> {
    try {
      const chats = await this._chatRepository.getChatsByUserId(userId);

      return chats;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    senderId: string,
    content: string,
    chatId: string,
    file?: boolean
  ): Promise<IMessage> {
    try {
      const response = await this._chatRepository.sendMessage(
        senderId,
        chatId,
        content,
        file
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(chatId: string): Promise<IMessage[]> {
    try {
      const messages = await this._chatRepository.getMessages(chatId);

      return messages;
    } catch (error) {
      throw error;
    }
  }
}
