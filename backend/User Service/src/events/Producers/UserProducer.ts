import { Producer, Message } from "kafkajs";
import { IUser, IUserInvite } from "../../interfaces/IUser";

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

  async inviteUsers(user: IUserInvite | IUser, token: string) {
    try {
      const eventType = "invite";

      const payload = {
        topic: "user-events",
        messages: [
          {
            value: JSON.stringify({
              eventType,
              invitee: user,
              token,
            }),
          },
        ],
      };

      await this.producer.send(payload);
      console.log(`Email has sent to user: ${user.email}`);
    } catch (error) {
      console.error("Error inviting user :", error);
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
