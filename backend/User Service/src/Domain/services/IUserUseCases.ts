import { ISubscription, ISubscriptionPlan, IUser, IUserInvite } from "../../Shared/interfaces";


export interface IUserUseCases {
  inviteUser(invitee: IUserInvite): Promise<IUserInvite>;
  verifyUser(token: string): Promise<string>;
  createUser(user: IUser): Promise<number | null>;
  createUserInvite(user: IUser): Promise<IUser | null>;
  getUsers(tenantId: string): Promise<(IUser | IUserInvite)[]>;
  editProfile(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  getAllTenantAdmins(): Promise<IUser[]>;
  login(
    username: string,
    password: string,
    useCase?: string
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
  getManagerList(tenantId: string): Promise<IUser[] | null>;
  getDevList(tenantId: string): Promise<IUser[] | null>;
  blockUser(userId: string): Promise<IUser>;
  verifyOtp(email: string, otp: number): Promise<Boolean>;
  createNewOtp(
    email: string
  ): Promise<{ isOtpSend: Boolean; user: IUser; otp: number }>;
  activateSubscription(userId: string, amount: number): Promise<IUser>;
  deactivateSubscription(userId: string): Promise<IUser>;
  updateAvatar(imageUrl: string, userId: string): Promise<IUser>;
  getSubscriptionHistory(tenantId: string): Promise<ISubscription[]>;
  getFullSubHistory(): Promise<ISubscription[]>;
  getSubscriptionPlans(): Promise<ISubscriptionPlan>;
  editSubscriptionPlan(newPlan: ISubscriptionPlan): Promise<ISubscriptionPlan>;
}
