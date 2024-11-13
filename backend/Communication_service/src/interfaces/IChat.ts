import { IMessage } from "./IMessage";
import { IUser } from "./IUser";


export interface IChat{
    _id?: string;
    isGroup: boolean;
    users: IUser[];
    lastMessage: IMessage;
    isGroupAdmin: boolean;
    chat: string;
}