import { IUser, IUserInvite } from "../../Shared/interfaces";
import { IUserUseCases } from "../../Shared/interfaces";
import { IUserRepository } from "../../Shared/interfaces";
import {
  createRefreshToken,
  createToken,
  verifyRefreshToken,
} from "../../Shared/Utils/Jwt";
import bcrypt from "bcryptjs";
import { CustomError } from "../../ErrorHandler/CustonError";
import { ISubscription } from "../../Shared/interfaces";
import { ISubscriptionPlan } from "../../Shared/interfaces";
import { StatusCode } from "../../Shared/interfaces";

export class UserUseCases implements IUserUseCases {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async inviteUser(invitee: IUserInvite): Promise<IUserInvite> {
    try {
      const user = await this._userRepository.inviteUser(invitee);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createNewOtp(
    email: string
  ): Promise<{ isOtpSend: Boolean; user: IUser; otp: number }> {
    try {
      const otp = await this._userRepository.createNewOtp(email);

      if (!otp) throw new Error(`error while creating new otp`);
      const user = await this._userRepository.findUser(email);

      if (user) return { isOtpSend: true, user, otp };
      else throw new Error(`error while retrieving user`);
    } catch (error) {
      throw error;
    }
  }
  async verifyOtp(email: string, otp: number): Promise<Boolean> {
    try {
      await this._userRepository.verifyOtp(email, otp);

      const isUserVerified = this._userRepository.updateVerify(email);

      return isUserVerified;
    } catch (error) {
      throw error;
    }
  }
  async blockUser(userId: string): Promise<IUser> {
    try {
      const devList = await this._userRepository.blockUser(userId);

      return devList as IUser;
    } catch (error) {
      throw error;
    }
  }
  async getDevList(tenantId: string): Promise<IUser[] | null> {
    try {
      const devList = await this._userRepository.findDevList(tenantId);

      return devList as IUser[];
    } catch (error) {
      throw error;
    }
  }
  async getManagerList(tenantId: string): Promise<IUser[] | null> {
    try {
      const managerList = await this._userRepository.findManagerList(tenantId);

      return managerList as IUser[] | null;
    } catch (error) {
      throw error;
    }
  }

  async login(
    username: string,
    password: string,
    useCase = "normal"
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    try {
      const user: IUser | null = await this._userRepository.findUser(username);
      if (!user)
        throw new CustomError(
          `User ${username} not exist`,
          StatusCode.BAD_REQUEST
        );
      console.log(user);

      if (user.isBlocked)
        throw new CustomError(
          `User ${username} blocked`,
          StatusCode.BAD_REQUEST
        );

      const accessToken = createToken(user);
      const refreshToken = createRefreshToken(user);

      if (useCase == "normal") {
        if (!user.isVerified)
          throw new CustomError(
            `User ${username} not verified`,
            StatusCode.BAD_REQUEST
          );
        const res = await bcrypt.compare(password, user.password);

        if (!res)
          throw new CustomError("Incorrect password", StatusCode.BAD_REQUEST);
      }

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(token: string): Promise<string> {
    try {
      const user: IUser = verifyRefreshToken(token);

      if (!user) throw new Error("User not found");

      const newAccessToken = createToken(user);

      return newAccessToken;
    } catch (error) {
      throw error;
    }
  }

  async getAllTenantAdmins(): Promise<IUser[]> {
    try {
      const users = await this._userRepository.getAllTenantAdmins();

      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await this._userRepository.findUserById(userId);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this._userRepository.findUser(email);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: IUser): Promise<number | null> {
    try {
      //checking duplicates
      const existUser: IUser | null = await this._userRepository.findUser(
        user.email
      );
      console.log("existing user", existUser);

      if (existUser && existUser.isVerified)
        throw new CustomError("User already exists", StatusCode.CONFLICT);
      else if (existUser && !existUser.isVerified) return null;

      return await this._userRepository.createUser(user);
    } catch (error) {
      throw error;
    }
  }

  async createUserInvite(user: IUser): Promise<IUser | null> {
    try {
      //checking duplicates
      const existUser: IUser | null = await this._userRepository.findUser(
        user.email
      );
      console.log("existing user", existUser);

      if (existUser) {
        throw new CustomError("User already exists", StatusCode.CONFLICT);
      } else return await this._userRepository.createUserInvite(user);
    } catch (error) {
      throw error;
    }
  }
  async getUsers(tenantId: string) {
    try {
      return await this._userRepository.getAllUsers(tenantId);
    } catch (error) {
      throw error;
    }
  }

  async editProfile(user: IUser): Promise<IUser> {
    try {
      const data = await this._userRepository.editProfile(user);

      if (!data)
        throw new CustomError("profile not modified", StatusCode.CONFLICT);

      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(user: IUser) {
    try {
      return await this._userRepository.updateUser(user);
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(imageUrl: string, userId: string): Promise<IUser> {
    try {
      const user = await this._userRepository.updateAvatar(imageUrl, userId);

      return user;
    } catch (error) {
      console.log("error while updating avatar");
      throw error;
    }
  }

  async activateSubscription(userId: string, amount: number): Promise<IUser> {
    try {
      if (!userId || !amount)
        throw new CustomError("required params missing", StatusCode.CONFLICT);

      const currentUser = await this._userRepository.findUserById(userId);

      if (currentUser?.subscriptionStatus)
        throw new CustomError(
          "You are already subscribed",
          StatusCode.CONFLICT
        );

      const updatedUser = await this._userRepository.activateSubscription(
        userId,
        amount
      );

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deactivateSubscription(userId: string): Promise<IUser> {
    try {
      if (!userId) throw new CustomError("user missing", StatusCode.CONFLICT);

      const currentUser = await this._userRepository.findUserById(userId);

      if (!currentUser?.subscriptionStatus)
        throw new CustomError("Already unSubscribed", StatusCode.CONFLICT);

      const updatedUser = await this._userRepository.deactivateSubscription(
        userId
      );

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionHistory(tenantId: string): Promise<ISubscription[]> {
    try {
      if (!tenantId)
        throw new CustomError("tenantId is required", StatusCode.CONFLICT);

      const historyList = await this._userRepository.getSubscriptionHistory(
        tenantId
      );

      return historyList;
    } catch (error) {
      throw error;
    }
  }

  async getFullSubHistory(): Promise<ISubscription[]> {
    try {
      const fullHistory = await this._userRepository.getFullSubHistory();

      return fullHistory;
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionPlans(): Promise<ISubscriptionPlan> {
    try {
      const subscribePlans = await this._userRepository.getSubscriptionPlans();

      return subscribePlans;
    } catch (error) {
      throw error;
    }
  }

  async editSubscriptionPlan(
    newPlan: ISubscriptionPlan
  ): Promise<ISubscriptionPlan> {
    try {
      const updatedPlan = await this._userRepository.editSubscriptionPlan(
        newPlan
      );

      return updatedPlan;
    } catch (error) {
      throw error;
    }
  }
}
