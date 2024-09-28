import { Consumer } from "kafkajs";
import { IUserConsumer } from "../../interfaces/IUserConsumer";
import { ConsumerRepository } from "../../repositories/ConsumerRepository";
import { IConsumerRepository } from "../../interfaces/IConsumerRepository";
import { IConsumerUseCases } from "../../interfaces/IConsumerUseCases";
import { ConsumeUseCaeses } from "../../use-cases/ConsumeUseCaeses";
import { IUser, IUserInvite } from "../../interfaces/IUser";

export class UserConsumer implements IUserConsumer {
  private consumerRepository: IConsumerRepository;
  private consumerUseCases: IConsumerUseCases;
  constructor(private consumer: Consumer) {
    this.consumerRepository = new ConsumerRepository();
    this.consumerUseCases = new ConsumeUseCaeses(this.consumerRepository);
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

  async handleConsume(data: {
    eventType: string;
    data: IUser;
    invitee: IUserInvite;
    otp: number;
    token: string;
  }) {
    switch (data.eventType) {
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
    }
  }
}
