import { IUser } from "../interfaces/IUser";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  createRefreshToken,
  createToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../Utils/Jwt";
import bcrypt from "bcrypt";

export class UserUseCases implements IUserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  async createNewOtp(
    email: string
  ): Promise<{ isOtpSend: Boolean; user: IUser; otp: number }> {
    try {
      const otp = await this.userRepository.createNewOtp(email);

      if (!otp) throw new Error(`error while creating new otp`);
      const user = await this.userRepository.findUser(email);

      if (user) return { isOtpSend: true, user, otp };
      else throw new Error(`error while creating new otp`);
    } catch (error) {
      throw error;
    }
  }
  async verifyOtp(email: string, otp: number): Promise<Boolean> {
    try {
      const verified = await this.userRepository.verifyOtp(email, otp);

      if (!verified) throw new Error("Error while verifying OTP");

      const isUserVerified = this.userRepository.updateVerify(email);

      return isUserVerified;
    } catch (error) {
      throw error;
    }
  }
  async blockUser(userId: string): Promise<IUser> {
    try {
      const devList = await this.userRepository.blockUser(userId);

      return devList as IUser;
    } catch (error) {
      throw error;
    }
  }
  async getDevList(): Promise<IUser[] | null> {
    try {
      const devList = await this.userRepository.findDevList();

      return devList as IUser[];
    } catch (error) {
      throw error;
    }
  }
  async getManagerList(): Promise<IUser[] | null> {
    try {
      const managerList = await this.userRepository.findManagerList();

      return managerList as IUser[] | null;
    } catch (error) {
      throw error;
    }
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    try {
      const user: IUser | null = await this.userRepository.findUser(
        data.username
      );
      if (!user) throw new Error(`User ${data.username} not exist`);

      const accessToken = createToken(user);
      const refreshToken = createRefreshToken(user);

      const res = await bcrypt.compare(data.password, user.password);

      if (!res) throw new Error(`Incorrect password`);

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw error;
    }
  }

  async verifyUser(token: string): Promise<string> {
    try {
      const user: IUser = verifyRefreshToken(token);

      if (!user) throw new Error("User not found");

      const newAccessToken = createToken(user);

      return newAccessToken;
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

  async createUser(user: IUser): Promise<Number | null> {
    try {
      //checking duplicates
      const existUser: IUser | null = await this.userRepository.findUser(
        user.email
      );
      console.log("existing user", existUser);

      if (existUser && existUser.isVerified) {
        throw new Error("User already exists");
      } else if (existUser && !existUser.isVerified) return null;

      return await this.userRepository.createUser(user);
    } catch (error: any) {
      throw error;
    }
  }

  async createUserInvite(user: IUser): Promise<IUser | null> {
    try {
      //checking duplicates
      const existUser: IUser | null = await this.userRepository.findUser(
        user.email
      );
      console.log("existing user", existUser);

      if (existUser) {
        throw new Error("User already exists");
      } else return await this.userRepository.createUserInvite(user);
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
