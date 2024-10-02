import { Producer } from "kafkajs";
import { IUser } from "../../interfaces/IUser";
import { ITenants } from "../../interfaces/ITenant";
import { kafkaTopic } from "../../interfaces/kafkaTopics";

export class UserProducer {
  constructor(private producer: Producer) {}

  async sendMessage(eventType: string, user: IUser, otp: Number) {
    try {
      console.log("sending to kafka");

      const payload = {
        topic: "user-events",
        messages: [
          {
            value: JSON.stringify({
              eventType,
              data: user,
              otp: otp,
            }),
          },
        ],
      };

      await this.producer.send(payload);
      console.log(
        `Message sent to topic 'user-events':  ${eventType}:`,
        user.email
      );
    } catch (error) {
      console.log(
        `Error sending message to 'user-events' ${eventType}:`,
        error
      );
      throw error;
    }
  }

  async notifyTenantCreation(tenant: ITenants) {
    const eventType = "tenant-created";
    try {
      console.log("sending to kafka");

      const payload = {
        topic: "tenant-events",
        messages: [
          {
            value: JSON.stringify({
              eventType,
              data: tenant,
            }),
          },
        ],
      };

      await this.producer.send(payload);
      console.log(
        `Message sent to topic 'user-events':  ${eventType}:`,
        tenant.company_name
      );
    } catch (error) {
      console.log(
        `Error sending message to 'user-events' ${eventType}:`,
        error
      );
      throw error;
    }
  }

  async sendDefaultMessage(eventType: string, topic: string, data: string) {
    try {
      console.log("sending to kafka");

      const payload = {
        topic: topic,
        messages: [
          {
            value: JSON.stringify({
              eventType,
              data: data,
            }),
          },
        ],
      };

      await this.producer.send(payload);
      console.log(`Message sent to topic 'user-events':  ${eventType}:`);
    } catch (error) {
      console.log(
        `Error sending message to 'user-events' ${eventType}:`,
        error
      );
      throw error;
    }
  }
}
