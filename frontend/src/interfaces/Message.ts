import { Chat } from "./Chat";
import { User } from "./User";

export interface Message {
  _id?: string;
  sender: User | string;
  content: string;
  chat: Chat | string;
  createdAt?: string;
  updatedAt?: string;
}
