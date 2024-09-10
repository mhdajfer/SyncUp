import { ObjectId } from "mongoose";
import { IUser } from "./IUser";

export interface IUserUseCases {
  createUser(user: IUser): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
  updateUser(user: IUser): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  //loginDev(username: string, password: string): Promise<IUser | null>;
}
