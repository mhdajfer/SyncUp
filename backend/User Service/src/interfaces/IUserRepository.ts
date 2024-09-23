import { IUser } from "../interfaces/IUser";

export interface IUserRepository {
  createUser(user: IUser): Promise<Number>;
  updateUser(user: IUser): Promise<IUser>;
  findUser(email: string): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  findManagerList(): Promise<IUser[]>;
  findDevList(): Promise<IUser[]>;
  blockUser(userId: string): Promise<IUser>;
  verifyOtp(email: string, otp: number): Promise<Boolean>;
  createNewOtp(email: string): Promise<Boolean>;
}
