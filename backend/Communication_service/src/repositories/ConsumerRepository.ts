import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { sendMail } from "../Utils/nodeMailer";

export class ConsumerRepository implements IConsumerRepository {
  async sendOtp(
    email: string,
    taskName: string,
    TaskDetails: string,
    otp: number
  ): Promise<void> {
    try {
      sendMail(email, taskName, TaskDetails, otp);
    } catch (error) {
      throw error;
    }
  }
}
