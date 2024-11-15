import { Message } from "./Message";
import { User } from "./User";

export interface Chat {
  _id?: string;
  isGroup: boolean;
  users: User[] | string[];
  chat: string | string;
  latestMessage: Message;
  isGroupAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}
