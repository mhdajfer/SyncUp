import { KafkaConnection } from "../Config/kafka/kafkaConnection";
import { IUserConsumer } from "../interfaces/IUserConsumer";
import { UserConsumer } from "./Consumers/userConsumer";

export const connectConsumers = async () => {
  const kafkaConnection = new KafkaConnection();
  const consumer = await kafkaConnection.getConsumerInstance(
    "communication-service-group"
  );

  const userConsumer: IUserConsumer = new UserConsumer(consumer);

   userConsumer.consumeMessages();
};
