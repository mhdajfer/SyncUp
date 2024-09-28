import { Producer, Message } from "kafkajs";
import { IUser } from "../../interfaces/IUser";

export class UserProducer {
  constructor(private producer: Producer) {}

  async sendMessage(eventType: string, user: IUser, otp: number) {
    try {
      console.log("sending to kafka");

      const messagePayload: Message[] = [
        {
          value: JSON.stringify({
            eventType,
            data: user,
            otp,
          }),
        },
      ];

      const payload = {
        topic: "user-events",
        messages: messagePayload,
      };

      await this.producer.send(payload);

      console.log(
        `Message sent to topic 'user-events': ${eventType}, Email: ${user.email}`
      );
    } catch (error) {
      console.error(
        `Error sending message to 'user-events' [${eventType}]:`,
        error
      );
      throw error;
    }
  }

  async notifyRegistrationSuccess(user: IUser) {
    try {
      const eventType = "user-registered-success";
      const payload = {
        topic: "user-events",
        messages: [
          {
            value: JSON.stringify({
              eventType,
              data: user,
            }),
          },
        ],
      };

      await this.producer.send(payload);
      console.log(
        `User registration success message sent for user: ${user.email}`
      );
    } catch (error) {
      console.error("Error notifying user registration success:", error);
      throw error;
    }
  }
}
