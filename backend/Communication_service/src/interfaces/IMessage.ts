import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IMessage {
  _id?: string;
  sender: IUser;
  content: string;
  chat: IChat;
}
