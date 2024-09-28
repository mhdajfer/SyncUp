export interface ITenantConsumer {
  consumeMessages(): Promise<void>;
}
