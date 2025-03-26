import { IUser } from "./IUser";

export interface ICall {
  user: string | IUser;
  otherUserId: string | IUser;
  startTime?: Date;
  status?: "completed" | "missed" | "ongoing";
  type?: "incoming" | "outgoing";
  createdAt?: Date;
  updatedAt?: Date;
}
