import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { IConsumerUseCases } from "../interfaces/IConsumerUseCases";

export class ConsumeUseCaeses implements IConsumerUseCases {
  constructor(private consumerRepository: IConsumerRepository) {}

  async sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp:number
  ): Promise<void> {
    try {
      await this.consumerRepository.sendOtp(email, taskName, taskDetails, otp);


      return console.log("otp sent....");
    } catch (error: any) {
      console.log(`Error while sending ${error.message}`);

      throw error;
    }
  }
}
