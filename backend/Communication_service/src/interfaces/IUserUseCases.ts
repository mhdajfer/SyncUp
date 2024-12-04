import { IUser } from "./IUser";

export interface IUserUseCases {
  updateUser(user: IUser): Promise<IUser>;
  findUserById(userId: string): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
}
