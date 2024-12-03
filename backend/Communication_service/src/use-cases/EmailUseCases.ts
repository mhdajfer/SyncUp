import { userInfo } from "os";
import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { IEmailUseCases } from "../interfaces/IEmailUseCases";
import { IUserInvite } from "../interfaces/IUser";

export class EmailUseCases implements IEmailUseCases {
  constructor(private _consumerRepository: IConsumerRepository) {}

  async sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void> {
    try {
      await this._consumerRepository.sendOtp(email, taskName, taskDetails, otp);

      return console.log("otp sent....");
    } catch (error: any) {
      console.log(`Error while sending ${error.message}`);

      throw error;
    }
  }

  async sendInvite(user: IUserInvite, token: string) {
    try {
      const data = await this._consumerRepository.sendInvite(user, token);
      return data;
    } catch (error) {
      console.log("Error while sending Invite (consumeUseCases)", error);

      throw error;
    }
  }
}
