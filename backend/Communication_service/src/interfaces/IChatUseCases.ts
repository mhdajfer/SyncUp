import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IChatUseCases{
    getAllUsers(): Promise<IUser[]>;
    getChat(userId1: string, userId2: string): Promise<IChat>;
    getAllChats(userId: string): Promise<IChat[]>;
}