import { IConsumerRepository } from "../interfaces";
import { Task } from "../interfaces";
import { IUserInvite } from "../interfaces";
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
      const link = `http://dummy.com/newPassword?token=${token}`;
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
    const dueDate = JSON.stringify(task.due_date).slice(0, 11);
    try {
      sendTaskAssignedMail(email, task.title, task.desc as string, dueDate);
    } catch (error) {
      throw error;
    }
  }
}
