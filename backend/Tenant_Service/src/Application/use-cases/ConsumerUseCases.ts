import { IConsumerRepository } from "../../Shared/interfaces";
import { IConsumerUseCases } from "../../Shared/interfaces";
import { IUser } from "../../Shared/interfaces";

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
      throw error;
    }
  }
}
