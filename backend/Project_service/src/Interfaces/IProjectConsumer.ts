export interface IProjectConsumer {
  consumeMessages(): Promise<void>;
}
