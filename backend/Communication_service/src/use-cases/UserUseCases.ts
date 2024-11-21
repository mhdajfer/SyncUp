import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserUseCases } from "../interfaces/IUserUseCases";

export class UserUseCases implements IUserUseCases {
  constructor(private userRepository: IUserRepository) {}

  async updateUser(user: IUser) {
    try {
      return await this.userRepository.updateUser(user);
    } catch (error: any) {
      throw error;
    }
  }

  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = await this.userRepository.createUser(data);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
