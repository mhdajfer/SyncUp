import { KafkaConnection } from "../../Config/kafka/kafkaConnection";
import { ProjectConsumer } from "./Consumers/projectConsumer";

export const connectConsumers = async () => {
  const kafkaConnection = new KafkaConnection();

  const consumer = await kafkaConnection.getConsumerInstance(
    "user-updations01"
  );

  const userConsumer = new ProjectConsumer(consumer);

  userConsumer.consumeMessages();
};
