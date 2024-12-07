import { IConsumerRepository } from "../interfaces";
import { IConsumerUseCases } from "../interfaces";
import { IUser } from "../interfaces";

export class ConsumerUseCases implements IConsumerUseCases {
  constructor(private _consumerRepository: IConsumerRepository) {}
  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = await this._consumerRepository.createUser(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: IUser) {
    try {
      return await this._consumerRepository.updateUser(user);
    } catch (error) {
      throw error
    }
  }
}
