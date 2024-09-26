import { ObjectId } from "mongoose";
import { IUser } from "./IUser";

export interface IUserUseCases {
  verifyUser(token: string): Promise<string>;
  createUser(user: IUser): Promise<Number | null>;
  createUserInvite(user: IUser): Promise<IUser | null>;
  getUsers(): Promise<IUser[]>;
  updateUser(user: IUser): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  login(data: {
    username: string;
    password: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
  getManagerList(): Promise<IUser[] | null>;
  getDevList(): Promise<IUser[] | null>;
  blockUser(userId: string): Promise<IUser>;
  verifyOtp(email: string, otp: number): Promise<Boolean>;
  createNewOtp(
    email: string
  ): Promise<{ isOtpSend: Boolean; user: IUser; otp: number }>;
}
