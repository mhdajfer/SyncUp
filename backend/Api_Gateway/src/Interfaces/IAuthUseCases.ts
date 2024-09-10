import { IUser } from "./IUser";

export interface IAuthUseCases {
  getUserByEmail(username: string): Promise<IUser | null>;
  login(data: { username: string; password: string }): Promise<{}>;
}
