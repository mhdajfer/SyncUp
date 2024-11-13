import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IMessage {
  _id?: string;
  sender: IUser | string;
  content: string;
  chat: IChat | string;
}
