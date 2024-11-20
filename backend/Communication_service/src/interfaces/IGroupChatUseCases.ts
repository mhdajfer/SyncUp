import { IChat } from "./IChat";
import { IUser } from "./IUser";


export interface IGroupChatUseCases{
    createGroupChat(groupName: string, users: IUser[], admin: IUser): Promise<IChat>;
    addNewMember(userIds: string[], chatId: string): Promise<IChat>;
}