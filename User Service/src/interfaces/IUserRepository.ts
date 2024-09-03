import { IUser } from "../interfaces/IUser";

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  findUser(user: IUser): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
}
