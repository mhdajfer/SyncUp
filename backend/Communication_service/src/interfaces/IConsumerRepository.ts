export interface IConsumerRepository {
  sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void>;
}
