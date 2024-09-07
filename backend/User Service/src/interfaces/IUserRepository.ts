import { ObjectId } from "mongoose";
import { IUser } from "../interfaces/IUser";

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  findUser(email: string): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
}
