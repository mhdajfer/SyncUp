import { ObjectId } from "mongoose";
import { IUser } from "./IUser";

export interface IUserUseCases {
  createUser(user: IUser): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
  updateUser(user: IUser): Promise<IUser>;
  getUser(email: string): Promise<IUser|null>;
}
