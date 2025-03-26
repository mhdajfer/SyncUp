import { KafkaConnection } from "../../Config/kafka/kafkaConnection";
import { IUserConsumer } from "../../Shared/interfaces";
import { UserConsumer } from "./Consumers/UserConsumer";

export const connectConsumers = async () => {
  const kafkaConnection = new KafkaConnection();
  const consumer = await kafkaConnection.getConsumerInstance(
    "communication-service-group"
  );

  const userConsumer: IUserConsumer = new UserConsumer(consumer);

  userConsumer.consumeMessages();
};
