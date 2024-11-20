import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IGroupChatRepository {
  createGroupChat(groupName: string, users: IUser[], admin: IUser): Promise<IChat>;
  AddNewMember(userIds: string[], chatId: string): Promise<IChat>;
}
