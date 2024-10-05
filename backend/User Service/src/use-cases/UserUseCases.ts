import { IUser, IUserInvite } from "../interfaces/IUser";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  createRefreshToken,
  createToken,
  verifyRefreshToken,
} from "../Utils/Jwt";
import bcrypt from "bcrypt";
import { CustomError } from "../ErrorHandler/CustonError";

export class UserUseCases implements IUserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async inviteUser(invitee: IUserInvite): Promise<IUserInvite> {
    try {
      const user = await this.userRepository.inviteUser(invitee);

      return user;
    } catch (error) {
      throw error;
    }
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
      await this.userRepository.verifyOtp(email, otp);

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
  async getDevList(tenantId: string): Promise<IUser[] | null> {
    try {
      const devList = await this.userRepository.findDevList(tenantId);

      return devList as IUser[];
    } catch (error) {
      throw error;
    }
  }
  async getManagerList(tenantId: string): Promise<IUser[] | null> {
    try {
      const managerList = await this.userRepository.findManagerList(tenantId);

      return managerList as IUser[] | null;
    } catch (error) {
      throw error;
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    try {
      const user: IUser | null = await this.userRepository.findUser(username);
      if (!user) throw new CustomError(`User ${username} not exist`, 400);
      console.log(user);

      if (!user.isVerified)
        throw new CustomError(`User ${username} not verified`, 400);
      if (user.isBlocked)
        throw new CustomError(`User ${username} blocked`, 400);

      const accessToken = createToken(user);
      const refreshToken = createRefreshToken(user);

      const res = await bcrypt.compare(password, user.password);

      if (!res) throw new CustomError("Incorrect password", 400);

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
      const user = await this.userRepository.findUser(email);

      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async createUser(user: IUser): Promise<number | null> {
    try {
      //checking duplicates
      const existUser: IUser | null = await this.userRepository.findUser(
        user.email
      );
      console.log("existing user", existUser);

      if (existUser && existUser.isVerified)
        throw new CustomError("User already exists", 409);
      else if (existUser && !existUser.isVerified) return null;

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
        throw new CustomError("User already exists", 409);
      } else return await this.userRepository.createUserInvite(user);
    } catch (error: any) {
      throw error;
    }
  }
  async getUsers(tenantId: string) {
    try {
      return await this.userRepository.getAllUsers(tenantId);
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
