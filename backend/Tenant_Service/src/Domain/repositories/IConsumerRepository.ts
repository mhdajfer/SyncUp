import { IUser } from "../../Shared/interfaces";


export interface IConsumerRepository {
  createUser(data: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
}
