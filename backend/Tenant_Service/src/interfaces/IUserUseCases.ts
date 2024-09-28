import { IUser } from "./IUser";

export interface IUserUseCases {
  findUser(email: string): Promise<IUser>;
}
