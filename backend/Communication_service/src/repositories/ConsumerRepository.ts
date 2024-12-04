import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { Task } from "../interfaces/IProject";
import { IUserInvite } from "../interfaces/IUser";
import { sendMail, sendTaskAssignedMail } from "../Utils/nodeMailer";

export class ConsumerRepository implements IConsumerRepository {
  async sendOtp(
    email: string,
    taskName: string,
    TaskDetails: string,
    otp: number
  ): Promise<void> {
    try {
      sendMail(email, taskName, TaskDetails, otp, "");
    } catch (error) {
      throw error;
    }
  }

  async sendInvite(user: IUserInvite, token: string) {
    try {
      const link = `http://localhost:3000/newPassword?token=${token}`;
      return sendMail(
        user.email,
        "invitation",
        "You are invited to the platform",
        0,
        link
      );
    } catch (error) {
      throw error;
    }
  }

  async informTaskAssigned(email: string, task: Task) {
    try {
      sendTaskAssignedMail(
        email,
        task.title,
        task.desc as string,
        JSON.stringify(task.due_date)
      );
    } catch (error) {
      throw error;
    }
  }
}
