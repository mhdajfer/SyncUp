import { IUser } from "../interfaces/IUser";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  createRefreshToken,
  createToken,
  verifyAccessToken,
} from "../Utils/Jwt";
import bcrypt from "bcrypt";

export class UserUseCases implements IUserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    try {
      const user: IUser | null = await this.userRepository.findUser(
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

  async verifyUser(token: string): Promise<IUser> {
    try {
      const user: IUser = verifyAccessToken(token);

      if (!user) throw new Error("User not found");
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findUserById(userId);
    } catch (error: any) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findUser(email);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createUser(user: IUser) {
    try {
      //checking duplicates
      const existUser: IUser | null = await this.userRepository.findUser(
        user.email
      );

      if (existUser) throw new Error("User already exists");

      return await this.userRepository.createUser(user);
    } catch (error: any) {
      throw error;
    }
  }
  async getUsers() {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error: any) {
      throw error;
    }
  }
  async updateUser(user: IUser) {
    try {
      return await this.userRepository.updateUser(user);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
