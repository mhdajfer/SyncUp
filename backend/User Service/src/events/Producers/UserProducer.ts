import { Producer } from "kafkajs";
import { IUser } from "../../interfaces/IUser";

export class UserProducer {
  constructor(private producer: Producer) {}

  async sendMessage(eventType: string, user: IUser, otp: Number) {
    try {
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
      console.error(
        `Error sending message to 'user-events' ${eventType}:`,
        error
      );
      throw error;
    }
  }
}
