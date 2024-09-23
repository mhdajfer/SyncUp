import { Producer, Consumer } from "kafkajs";

export interface IKafkaConnection {
  getProducerInstance(): Promise<Producer>;
  getConsumerInstance(groupId: string): Promise<Consumer>;
  disconnectProducer?(): Promise<void>;
  disconnectConsumer?(): Promise<void>;
}
