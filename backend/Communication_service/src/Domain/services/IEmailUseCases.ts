import { IUserInvite, Task } from "../../Shared/interfaces";


export interface IEmailUseCases {
  sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void>;

  informTaskAssigned(email: string, task: Task): Promise<void>;

  sendInvite(user: IUserInvite, token: string): Promise<void>;
}
