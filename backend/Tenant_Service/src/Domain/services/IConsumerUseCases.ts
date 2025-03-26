import { IUser } from "../../Shared/interfaces";


export interface IConsumerUseCases {
  createUser(data: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
}
