import { Consumer } from "kafkajs";
import { IUserConsumer } from "../../../Shared/interfaces/IUserConsumer";
import { ConsumerRepository } from "../../repositories";
import { EmailUseCases } from "../../../Application/use-cases";
import { IUser, IUserInvite } from "../../../Shared/interfaces/IUser";
import { UserRepository } from "../../repositories/UserRepository";
import { UserUseCases } from "../../../Application/use-cases";
import { Task } from "../../../Shared/interfaces/IProject";
import { IConsumerRepository, IUserRepository } from "../../../Domain/repositories";
import { IEmailUseCases, IUserUseCases } from "../../../Domain/services";

export class UserConsumer implements IUserConsumer {
  private consumerRepository: IConsumerRepository;
  private consumerUseCases: IEmailUseCases;
  private userUseCases: IUserUseCases;
  private userRepository: IUserRepository;
  constructor(private consumer: Consumer) {
    this.consumerRepository = new ConsumerRepository();
    this.consumerUseCases = new EmailUseCases(this.consumerRepository);

    this.userRepository = new UserRepository();
    this.userUseCases = new UserUseCases(this.userRepository);
  }

  async consumeMessages() {
    try {
      await this.consumer.subscribe({
        topic: `user-events`,
        fromBeginning: true,
      });
      console.log(`Subscribed to topic: user-events`);

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const data = message.value?.toString();
          console.log(`Received message from topic ${topic}: ${data}`);
          if (data) this.handleConsume(JSON.parse(data));
        },
      });
    } catch (error) {
      console.error("Error consuming messages from Kafka:", error);
      throw error;
    }
  }

  async handleConsume(
    data:
      | string
      | {
          eventType: string;
          data: IUser;
          invitee: IUserInvite;
          otp: number;
          token: string;
        }
  ) {
    if (typeof data === "string") {
      data = JSON.parse(data) as {
        eventType: string;
        data: IUser;
        invitee: IUserInvite;
        otp: number;
        token: string;
      };

      if (data.eventType === "task-added")
        return data as unknown as {
          eventType: string;
          data: Task;
          invitee: IUserInvite;
          otp: number;
          token: string;
        };
    }

    switch (data.eventType) {
      case "task-added":
        const updatedData = JSON.parse(
          data.data as unknown as string
        )[0] as Task;
        console.log(updatedData);
        const user = await this.userUseCases.findUserById(updatedData.assignee);
        this.consumerUseCases.informTaskAssigned(user.email, updatedData);
        break;
      case "create":
        console.log("its create", data);

        this.consumerUseCases.sendOtp(
          data.data.email,
          "otp verification",
          "verification",
          data.otp
        );
        break;
      case "invite":
        console.log("its invite**", data);
        this.consumerUseCases.sendInvite(data.invitee, data.token);
        break;
      case "user-registered-success":
        console.log(
          "*****user verified in user service & creating user in tenant service**********",
          data
        );

        await this.userUseCases.createUser(data.data);
        break;
      case "user-updated":
        console.log("*****user updating in user service**********", data);

        console.log("original data*************", data);

        await this.userUseCases.updateUser(
          JSON.parse(data.data as unknown as string) as IUser
        );
        break;
    }
  }
}
