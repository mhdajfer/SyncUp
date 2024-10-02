import { IUser, IUserInvite } from "./IUser";

export interface IUserUseCases {
  inviteUser(invitee: IUserInvite): Promise<IUserInvite>;
  verifyUser(token: string): Promise<string>;
  createUser(user: IUser): Promise<number | null>;
  createUserInvite(user: IUser): Promise<IUser | null>;
  getUsers(tenantId: string): Promise<(IUser | IUserInvite)[]>;
  updateUser(user: IUser): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  login(
    username: string,
    password: string
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
  getManagerList(): Promise<IUser[] | null>;
  getDevList(): Promise<IUser[] | null>;
  blockUser(userId: string): Promise<IUser>;
  verifyOtp(email: string, otp: number): Promise<Boolean>;
  createNewOtp(
    email: string
  ): Promise<{ isOtpSend: Boolean; user: IUser; otp: number }>;
}
