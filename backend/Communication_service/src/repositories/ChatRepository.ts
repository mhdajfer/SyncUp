import Chat from "../frameworks/models/chatModel";
import Message from "../frameworks/models/messageModel";
import User from "../frameworks/models/userModel";
import { IChat } from "../interfaces/IChat";
import { IChatRepository } from "../interfaces/IChatRepository";
import { IMessage } from "../interfaces/IMessage";
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

  async sendMessage(
    senderId: string,
    chatId: string,
    content: string
  ): Promise<IMessage> {
    try {
      const msgData = {
        sender: senderId,
        content: content,
        chat: chatId,
      };

      console.log(msgData);
      let createdChat = await Message.create(msgData);

      const newChat = await Message.find({ _id: createdChat._id })
        .populate("sender", "-password")
        .populate({
          path: "chat",
          populate: {
            path: "users",
            select: "firstName lastName email avatar",
          },
        });

      console.log(newChat);

      return newChat as unknown as IMessage;
    } catch (error) {
      throw error;
    }
  }

  async getMessages(chatId: string): Promise<IMessage[]> {
    try {
      const messages = await Message.find({ chat: chatId }).populate(
        "sender",
        "-password"
      );

      console.log(messages);

      return messages as unknown as IMessage[];
    } catch (error) {
      throw error;
    }
  }
}
