import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { IConsumerUseCases } from "../interfaces/IConsumerUseCases";
import { IUser } from "../interfaces/IUser";

export class ConsumerUseCases implements IConsumerUseCases {
  constructor(private consumerRepository: IConsumerRepository) {}
  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = await this.consumerRepository.createUser(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: IUser) {
    try {
      return await this.consumerRepository.updateUser(user);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
