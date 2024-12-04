import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserUseCases } from "../interfaces/IUserUseCases";

export class UserUseCases implements IUserUseCases {
  constructor(private _userRepository: IUserRepository) {}

  async updateUser(user: IUser) {
    try {
      return await this._userRepository.updateUser(user);
    } catch (error: any) {
      throw error;
    }
  }

  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = await this._userRepository.createUser(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string): Promise<IUser> {
    try {
      const user = await this._userRepository.findUserById(userId);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
