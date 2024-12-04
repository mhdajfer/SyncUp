import { Task } from "./IProject";
import { IUserInvite } from "./IUser";

export interface IConsumerRepository {
  sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void>;

  informTaskAssigned(email: string, task: Task): Promise<void>;

  sendInvite(user: IUserInvite, token: string): Promise<void>;
}
