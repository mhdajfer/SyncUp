import { Consumer } from "kafkajs";
import { ITenantConsumer } from "../../../Shared/interfaces/IUserConsumer";
import { ConsumerRepository } from "../../repository/ConsumerRepository";
import { ConsumerUseCases } from "../../../Application/use-cases/ConsumerUseCases";
import { IUser } from "../../../Shared/interfaces/IUser";
import { IConsumerRepository, IConsumerUseCases } from "../../../Shared/interfaces";

export class TenantConsumer implements ITenantConsumer {
  private consumerRepository: IConsumerRepository;
  private consumerUseCases: IConsumerUseCases;
  constructor(private consumer: Consumer) {
    this.consumerRepository = new ConsumerRepository();
    this.consumerUseCases = new ConsumerUseCases(this.consumerRepository);
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

  async handleConsume(data: { eventType: string; data: IUser | string }) {
    try {
      switch (data.eventType) {
        case "user-registered-success":
          console.log(
            "*****user verified in user service & creating user in tenant service**********",
            data
          );

          await this.consumerUseCases.createUser(data.data as IUser);
          break;
        case "user-updated":
          const userData = JSON.parse(data.data as string);
          console.log("*****user updating in user service**********", data);

          console.log("original data*************", data);

          await this.consumerUseCases.updateUser(userData as IUser);
          break;
      }
    } catch (error) {
      console.log("Error while creating user in tenant service", error);
    }
  }
}
