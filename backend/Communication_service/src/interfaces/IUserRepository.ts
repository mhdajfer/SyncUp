import { IUser } from "./IUser";

export interface IUserRepository {
  updateUser(user: IUser): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
}
