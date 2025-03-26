import { Chat } from "../../Domain/models";
import { IGroupChatRepository } from "../../Domain/repositories";
import { IChat } from "../../Shared/interfaces";
import { IUser } from "../../Shared/interfaces";

export class GroupChatRepository implements IGroupChatRepository {
  async createGroupChat(
    groupName: string,
    users: IUser[],
    admin: IUser
  ): Promise<IChat> {
    try {
      users = [...users, admin];
      let newGroupChat = await Chat.create({
        isGroup: true,
        chat: groupName,
        users,
        groupAdmin: admin,
      });

      return newGroupChat as unknown as IChat;
    } catch (error) {
      throw error;
    }
  }

  async AddNewMember(userIds: string[], chatId: string): Promise<IChat> {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: { $each: userIds } } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return updatedChat as unknown as IChat;
    } catch (error) {
      throw error;
    }
  }

  async removeMember(userId: string, chatId: string): Promise<IChat> {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return updatedChat as unknown as IChat;
    } catch (error) {
      throw error;
    }
  }
}
