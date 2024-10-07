import { IUser } from "../interfaces/IUser";

export interface IConsumerUseCases {
  createUser(data: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
}
