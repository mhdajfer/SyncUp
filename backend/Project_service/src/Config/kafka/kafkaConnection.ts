import { Consumer, Kafka, Producer } from "kafkajs";
import { IKafkaConnection } from "../../Interfaces/IKafkaConnection";

const kafkaInstance = new Kafka({
  clientId: process.env.SERVICE || "syncUp-client",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

export class KafkaConnection implements IKafkaConnection {
  private static producer: Producer;
  private consumer?: Consumer;

  async getProducerInstance() {
    try {
      if (!KafkaConnection.producer) {
        KafkaConnection.producer = kafkaInstance.producer();
        await KafkaConnection.producer.connect();
        console.log("Kafka Producer connected");
      }
      return KafkaConnection.producer;
    } catch (error) {
      console.error(
        "Error in KafkaConnection getProducerInstance method:",
        error
      );
      throw error;
    }
  }

  async getConsumerInstance(groupId: string) {
    try {
      if (!this.consumer) {
        this.consumer = kafkaInstance.consumer({ groupId: groupId });
        await this.consumer.connect();
        console.log(`Kafka Consumer connected to group ${groupId}`);
      }
      return this.consumer;
    } catch (error) {
      console.error(
        "Error in KafkaConnection getConsumerInstance method:",
        error
      );
      throw error;
    }
  }

  async disconnectProducer() {
    if (KafkaConnection.producer) {
      await KafkaConnection.producer.disconnect();
      console.log("Kafka Producer disconnected");
    }
  }

  async disconnectConsumer() {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log("Kafka Consumer disconnected");
    }
  }
}
