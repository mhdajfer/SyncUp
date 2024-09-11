import { IAuthRepository } from "../Interfaces/IAuthRepository";
import { IAuthUseCases } from "../Interfaces/IAuthUseCases";
import { IUser } from "../Interfaces/IUser";
import {
  createRefreshToken,
  createToken,
  verifyAccessToken,
} from "../Utils/Jwt";
import bcrypt from "bcrypt";

export class AuthUseCases implements IAuthUseCases {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }
  async verifyUser(token: string): Promise<IUser> {
    try {
      const user: IUser = verifyAccessToken(token);

      //const user = await this.authRepository.findUser(decoded.email);
      if (!user) throw new Error("User not found");
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUserByEmail(username: string): Promise<IUser | null> {
    try {
      return await this.authRepository.findUser(username);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    try {
      const user: IUser | null = await this.authRepository.findUser(
        data.username
      );
      if (!user) throw new Error(`User ${data.username} not found`);
      
      const accessToken = createToken(user);
      const refreshToken = createRefreshToken(user);

      const res = await bcrypt.compare(data.password, user.password);

      if (!res) throw new Error(`Incorrect password`);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw error;
    }
  }
}
