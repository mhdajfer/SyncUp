import { Consumer } from "kafkajs";
import { IProjectRepository } from "../../Interfaces/IProjectRepository";
import { IProjectUseCases } from "../../Interfaces/IProjectUseCases";
import { ProjectRepository } from "../../Repositories/ProjectRepository";
import { ProjectUseCases } from "../../Use-cases/ProjectUseCases";
import { IProjectConsumer } from "../../Interfaces/IProjectConsumer";
import { IUser } from "../../Interfaces/IUser";

export class ProjectConsumer implements IProjectConsumer {
  private projectRepository: IProjectRepository;
  private projectUseCases: IProjectUseCases;
  constructor(private consumer: Consumer) {
    this.projectRepository = new ProjectRepository();
    this.projectUseCases = new ProjectUseCases(this.projectRepository);
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
        case "user-registered-success":
          console.log(
            "*****user verified in user service & creating user in tenant service**********",
            data
          );

          await this.projectUseCases.createUser(data.data as IUser);
          break;
        case "user-updated":
          console.log("*****user updating in user service**********", data);

          console.log("original data*************", data);

          await this.projectUseCases.updateUser(JSON.parse(data.data));
          break;
      }
    } catch (error) {
      console.log("Error while creating user in tenant service", error);
    }
  }
}
