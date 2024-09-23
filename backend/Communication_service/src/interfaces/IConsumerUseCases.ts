export interface IConsumerUseCases {
  sendOtp(
    email: string,
    taskName: string,
    taskDetails: string,
    otp: number
  ): Promise<void>;
}
