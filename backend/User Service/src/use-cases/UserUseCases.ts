import { ObjectId } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserUseCases implements IUserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
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
