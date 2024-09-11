import { IUser } from "../Interfaces/IUser";

export interface IAuthRepository {
  findUser(email: string): Promise<IUser | null>;
  verifyUser(token: string): Promise<Boolean>;
}
