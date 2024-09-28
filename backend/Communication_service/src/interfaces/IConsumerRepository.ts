import { IUserInvite } from "./IUser";

export interface IConsumerRepository {
  sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void>;

  sendInvite(user: IUserInvite, token: string): Promise<void>;
}
