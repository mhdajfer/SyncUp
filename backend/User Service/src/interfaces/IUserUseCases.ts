import { ObjectId } from "mongoose";
import { IUser } from "./IUser";

export interface IUserUseCases {
  verifyUser(token: string): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
  getUsers(): Promise<IUser[]>;
  updateUser(user: IUser): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  login(data: {
    username: string;
    password: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
  getManagerList(): Promise<IUser[] | null>;
}
