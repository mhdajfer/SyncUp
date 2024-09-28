import { IUser } from "./IUser";

export interface IUserRepository {
  findUser(email: string): Promise<IUser>;
}
