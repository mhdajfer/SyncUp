import { KafkaConnection } from "../../Config/kafka/kafkaConnection";
import { TenantConsumer } from "./Consumers/TenantConsumer";

export const connectConsumers = async () => {
  const kafkaConnection = new KafkaConnection();

  const consumer = await kafkaConnection.getConsumerInstance(
    "user-registered-success"
  );

  const tenantConsumer = new TenantConsumer(consumer);

  tenantConsumer.consumeMessages();
};
