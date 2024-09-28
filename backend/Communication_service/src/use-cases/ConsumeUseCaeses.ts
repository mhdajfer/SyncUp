import { userInfo } from "os";
import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { IConsumerUseCases } from "../interfaces/IConsumerUseCases";
import { IUserInvite } from "../interfaces/IUser";

export class ConsumeUseCaeses implements IConsumerUseCases {
  constructor(private consumerRepository: IConsumerRepository) {}

  async sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void> {
    try {
      await this.consumerRepository.sendOtp(email, taskName, taskDetails, otp);

      return console.log("otp sent....");
    } catch (error: any) {
      console.log(`Error while sending ${error.message}`);

      throw error;
    }
  }

  async sendInvite(user: IUserInvite, token: string) {
    try {
      const data = await this.consumerRepository.sendInvite(user, token);
      return data;
    } catch (error) {
      console.log("Error while sending Invite (consumeUseCases)", error);

      throw error;
    }
  }
}
