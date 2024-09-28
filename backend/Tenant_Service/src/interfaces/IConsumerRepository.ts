import { IUser } from "./IUser";

export interface IConsumerRepository {
  createUser(data: IUser): Promise<IUser>;
}
