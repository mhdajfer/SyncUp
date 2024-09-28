import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserUseCases } from "../interfaces/IUserUseCases";

export class UserUseCases implements IUserUseCases {
  constructor(private userRepository: IUserRepository) {}

  async findUser(email: string): Promise<IUser> {
    try {
      const user = await this.userRepository.findUser(email);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
