import { promises } from "dns";
import { IUser } from "./IUser";
import { ObjectId } from "mongoose";

export interface IUserUseCases {
  createUser(user: IUser);
  getUsers();
  updateUser(user: IUser);
  deleteUser(userId: ObjectId);
}
