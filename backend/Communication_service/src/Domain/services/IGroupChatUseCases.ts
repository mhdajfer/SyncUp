import { IChat, IUser } from "../../Shared/interfaces";



export interface IGroupChatUseCases{
    createGroupChat(groupName: string, users: IUser[], admin: IUser): Promise<IChat>;
    addNewMember(userIds: string[], chatId: string): Promise<IChat>;
    removeMember(userId: string, chatId: string): Promise<IChat>;
}