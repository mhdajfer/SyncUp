import { IUser } from "../../Shared/interfaces";


export interface IUserRepository {
  updateUser(user: IUser): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
  findUserById(userId: string): Promise<IUser>;
}
