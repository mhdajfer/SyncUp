import Chat from "../frameworks/models/chatModel";
import User from "../frameworks/models/userModel";
import { IChat } from "../interfaces/IChat";
import { IChatRepository } from "../interfaces/IChatRepository";
import { IUser } from "../interfaces/IUser";

export class ChatRepository implements IChatRepository {
  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find();

      return users as unknown as IUser[];
    } catch (error) {
      throw error;
    }
  }
  async getChat(userId1: string, userId2: string): Promise<IChat> {
    try {
      const chat = await Chat.findOne({
        users: { $all: [userId1, userId2] },
        isGroup: false,
      })
        .populate("users", " -password")
        .populate("latestMessage");

      return chat as unknown as IChat;
    } catch (error) {
      throw error;
    }
  }

  async createChat(userId1: string, userId2: string): Promise<IChat> {
    try {
      const chatData = {
        chat: "singleChat",
        users: [userId1, userId2],
      };

      const createdChat = (await Chat.create(chatData)).populate(
        "user",
        "-password"
      );

      return createdChat as unknown as IChat;
    } catch (error) {
      throw error;
    }
  }

  async getChatsByUserId(userId: string): Promise<IChat[]> {
    try {
      const chats = await Chat.find({
        users: { $in: [userId] },
      }).populate("users", "-password");

      return chats as unknown as IChat[];
    } catch (error) {
      throw error;
    }
  }
}
