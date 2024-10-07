import { Consumer } from "kafkajs";
import { IUser } from "../../interfaces/IUser";
import { IUserConsumer } from "../../interfaces/IUserConsumer";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { IUserUseCases } from "../../interfaces/IUserUseCases";
import { UserRepository } from "../../repositories/UserRepository";
import { UserUseCases } from "../../use-cases/UserUseCases";

export class UserConsumer implements IUserConsumer {
  private userRepository: IUserRepository;
  private userUseCases: IUserUseCases;
  constructor(private consumer: Consumer) {
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
          if (data) this.handleConsume(data);
        },
      });
    } catch (error) {
      console.error("Error consuming messages from Kafka:", error);
      throw error;
    }
  }

  async handleConsume(rawData: string) {
    const data = JSON.parse(rawData);
    try {
      switch (data.eventType) {
        case "user-updated":
          console.log("*****user updating in user service**********", data);

          console.log("original data*************", data);

          await this.userUseCases.updateUser(JSON.parse(data.data));
          break;
      }
    } catch (error) {
      console.log("Error while creating user in tenant service", error);
    }
  }
}
