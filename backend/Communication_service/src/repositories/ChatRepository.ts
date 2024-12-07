import { Chat } from "../frameworks/models";
import { Message } from "../frameworks/models";
import { User } from "../frameworks/models";
import { IChat } from "../interfaces";
import { IChatRepository } from "../interfaces";
import { IMessage } from "../interfaces";
import { IUser } from "../interfaces";

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

      const createdChat = await Chat.create(chatData);

      console.log(createdChat);

      const newChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return newChat as unknown as IChat;
    } catch (error) {
      throw error;
    }
  }

  async getChatsByUserId(userId: string): Promise<IChat[]> {
    try {
      const chats = await Chat.find({
        users: { $in: [userId] },
      })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin", "-password");

      console.log("all chats", chats);

      return chats as unknown as IChat[];
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    senderId: string,
    chatId: string,
    content: string,
    file?: boolean
  ): Promise<IMessage> {
    try {
      const msgData = {
        sender: senderId,
        content: content,
        chat: chatId,
        file,
      };

      let createdChat = await Message.create(msgData);
      await Chat.findByIdAndUpdate(chatId, { latestMessage: createdChat._id });

      const newChat = await Message.findOne({ _id: createdChat._id })
        .populate("sender", "-password")
        .populate({
          path: "chat",
          populate: {
            path: "users",
            select: "firstName lastName email avatar",
          },
        });

      // console.log("its from repository", newChat?.chat);

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
