import { IAuthRepository } from "../Interfaces/IAuthRepository";
import { IAuthUseCases } from "../Interfaces/IAuthUseCases";
import { IUser } from "../Interfaces/IUser";

export class AuthUseCases implements IAuthUseCases {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async getUserByEmail(username: string): Promise<IUser | null> {
    try {
      return await this.authRepository.findUser(username);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  login(data: { username: string; password: string }): Promise<{}> {
    throw new Error("Method not implemented.");
  }
}
