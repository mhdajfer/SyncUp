import { ObjectId } from "mongoose";
import { IUser } from "../interfaces/IUser";

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  findUser(userId: string): Promise<IUser|null>;
  getAllUsers(): Promise<IUser[]>;
}
