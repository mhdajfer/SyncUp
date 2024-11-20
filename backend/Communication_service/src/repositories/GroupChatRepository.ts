import Chat from "../frameworks/models/chatModel";
import { IChat } from "../interfaces/IChat";
import { IGroupChatRepository } from "../interfaces/IGroupChatRepository";
import { IUser } from "../interfaces/IUser";

export class GroupChatRepository implements IGroupChatRepository {
  async createGroupChat(
    groupName: string,
    users: IUser[],
    admin: IUser
  ): Promise<IChat> {
    try {
      const newGroupChat = await Chat.create({
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
}
