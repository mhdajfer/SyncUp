import { CustomError } from "../ErrorHandler/CustonError";
import { IChat } from "../interfaces/IChat";
import { IChatRepository } from "../interfaces/IChatRepository";
import { IChatUseCases } from "../interfaces/IChatUseCases";
import { IUser } from "../interfaces/IUser";

export class ChateUseCases implements IChatUseCases {
  constructor(private chatRepository: IChatRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.chatRepository.getAllUsers();

      return users;
    } catch (error) {
      throw error;
    }
  }
  async getChat(userId1: string, userId2: string): Promise<IChat> {
    try {
      let chat = await this.chatRepository.getChat(userId1, userId2);

      if (!chat) await this.chatRepository.createChat(userId1, userId2);

      chat = await this.chatRepository.getChat(userId1, userId2);

      return chat;
    } catch (error) {
      throw error;
    }
  }

  async getAllChats(userId: string): Promise<IChat[]> {
    try {
      const chats = await this.chatRepository.getChatsByUserId(userId);

      return chats;
    } catch (error) {
      throw error;
    }
  }
}
