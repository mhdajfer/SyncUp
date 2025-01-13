import { User } from "./User";

export interface Call {
  _id?: string;
  user: string | User;
  otherUserId: string | User;
  startTime?: Date;
  status: "completed" | "missed" | "ongoing";
  type: "incoming" | "outgoing";
  createdAt?: Date;
  updatedAt?: Date;
}
