import { KafkaConnection } from "../Config/kafka/kafkaConnection";
import { UserConsumer } from "./Consumers/userConsumer";

export const connectConsumers = async () => {
  const kafkaConnection = new KafkaConnection();

  const consumer = await kafkaConnection.getConsumerInstance("user-updations");

  const userConsumer = new UserConsumer(consumer);

  userConsumer.consumeMessages();
};
