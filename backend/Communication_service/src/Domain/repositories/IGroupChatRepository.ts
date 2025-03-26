import { IChat, IUser } from "../../Shared/interfaces";


export interface IGroupChatRepository {
  createGroupChat(
    groupName: string,
    users: IUser[],
    admin: IUser
  ): Promise<IChat>;
  AddNewMember(userIds: string[], chatId: string): Promise<IChat>;
  removeMember(userId: string, chatId: string): Promise<IChat>;
}
