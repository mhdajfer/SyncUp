import { IUser, IUserInvite } from "../interfaces/IUser";

export interface IUserRepository {
  inviteUser(invitee: IUserInvite): Promise<IUserInvite>;
  createUser(user: IUser): Promise<number>;
  createUserInvite(user: IUser): Promise<IUser>;
  editProfile(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  findUser(email: string): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;
  getAllUsers(tenantId: string): Promise<(IUser | IUserInvite)[]>;
  findManagerList(tenantId: string): Promise<IUser[]>;
  findDevList(tenantId: string): Promise<IUser[]>;
  blockUser(userId: string): Promise<IUser>;
  verifyOtp(email: string, otp: number): Promise<Boolean>;
  createNewOtp(email: string): Promise<null | number>;
  updateVerify(email: string): Promise<Boolean>;
  updateAvatar(imageUrl: string, userId: string): Promise<IUser>;
  getAllTenantAdmins(): Promise<IUser[]>;
}
