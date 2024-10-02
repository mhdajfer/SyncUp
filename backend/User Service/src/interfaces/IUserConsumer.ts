export interface IUserConsumer {
  consumeMessages(): Promise<void>;
}
