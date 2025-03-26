import { IUser } from "../../Shared/interfaces";


export interface IUserUseCases {
  updateUser(user: IUser): Promise<IUser>;
  findUserById(userId: string): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
}
