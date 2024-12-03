import { IUser, IUserInvite } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import User from "../frameworks/models/userModel";
import { ObjectId } from "mongodb";
import Otp from "../frameworks/models/otpModel";
import { CustomError } from "../ErrorHandler/CustonError";
import Invitee from "../frameworks/models/inviteeModel";
import { ISubscription } from "../interfaces/ISubscription";
import SubscriptionModel from "../frameworks/models/subscriptionModel";
import { ISubscriptionPlan } from "../interfaces/ISubscriptionPlan";
import SubscriptionPlanModel from "../frameworks/models/subscriptionPlanModel";
import { StatusCode } from "../interfaces/StatusCode";

export class UserRepository implements IUserRepository {
  async inviteUser(invitee: IUserInvite): Promise<IUserInvite> {
    try {
      const newUser = new Invitee(invitee);

      const data = await newUser.save();
      if (!data) throw new CustomError("invitee not created", 400);

      return data as IUserInvite;
    } catch (error) {
      throw error;
    }
  }

  async updateVerify(email: string): Promise<Boolean> {
    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        { isVerified: true }
      );

      if (user) return true;
      else throw new Error("Error while updating isVerified");
    } catch (error) {
      throw error;
    }
  }
  async createNewOtp(email: string): Promise<null | number> {
    try {
      const otp = this.generateRandom4DigitNumber();
      console.log("created new otp  : ", otp);

      const newOtpData = new Otp({ email, otp });

      const data = await newOtpData.save();

      if (data) return otp;
      else return null;
    } catch (error) {
      throw error;
    }
  }
  async verifyOtp(email: string, otp: number): Promise<Boolean> {
    try {
      const user: { email: string; otp: number } | null = await Otp.findOne({
        email,
      }).sort({ createdAt: -1 });

      if (!user) throw new CustomError("No user found", 400);

      console.log(
        ` checking whether ${otp} and ${user.otp} are same.............}`
      );

      if (user.otp == otp) {
        return true;
      } else throw new CustomError("otp not matching", 409);
    } catch (error) {
      throw error;
    }
  }
  async blockUser(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new CustomError("User not found", 400);
      }

      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        { isBlocked: !user.isBlocked },
        { new: true }
      );

      return updatedUser as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }
  async findDevList(tenantId: string): Promise<IUser[]> {
    try {
      const devList: IUser[] = await User.find({
        role: "dev",
        tenant_id: tenantId,
      });

      return devList;
    } catch (error) {
      throw error;
    }
  }
  async findManagerList(tenantId: string): Promise<IUser[]> {
    try {
      const managerList: IUser[] = await User.find({
        role: "pManager",
        tenant_id: tenantId,
      });

      return managerList;
    } catch (error) {
      throw error;
    }
  }
  async findUserById(userId: string): Promise<IUser | null> {
    try {
      const user: IUser | null = await User.findById(userId);

      return user;
    } catch (error) {
      throw error;
    }
  }
  async getAllUsers(tenantId: string): Promise<(IUser | IUserInvite)[]> {
    try {
      const userList: IUser[] = await User.find({ tenant_id: tenantId });

      const invitees: IUserInvite[] = await Invitee.find({
        tenant_id: tenantId,
      });

      const Users = [...userList, ...invitees];

      console.log(Users);

      return Users;
    } catch (error) {
      console.log(`Error while getting all users`);

      throw error;
    }
  }
  async createUser(user: IUser): Promise<number> {
    try {
      console.log("creating new user .....");

      console.log("inside repository...:", user);

      const newUser = new User(user);
      await newUser.save();

      const otp = this.generateRandom4DigitNumber();
      console.log(`otp for ${user.email} is ${otp}`);

      const newOtpData = new Otp({ email: user.email, otp });

      await newOtpData.save();

      return otp;
    } catch (error) {
      console.error("Error creating user in repository: ", error);
      throw error;
    }
  }

  async createUserInvite(user: IUser): Promise<IUser> {
    try {
      console.log(user);

      console.log("creating new user .....");

      const newUser = new User(user);
      await newUser.save();

      await Invitee.deleteOne({ email: user.email });

      return newUser.toObject() as IUser;
    } catch (error) {
      console.error("Error creating user in repository: ", error);
      throw error;
    }
  }
  async updateUser(user: IUser): Promise<IUser> {
    try {
      console.log("inside repository", user.tenant_id);
      delete user._id;

      const response = await User.updateMany(
        { email: user.email },
        { ...user }
      );

      return response as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }

  async getAllTenantAdmins(): Promise<IUser[]> {
    try {
      console.log("users");
      const users = await User.find({ role: "tenant-admin" });

      return users as unknown as IUser[];
    } catch (error) {
      throw error;
    }
  }
  async findUser(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email });
      return user?.toObject() as IUser;
    } catch (error) {
      throw error;
    }
  }

  async editProfile(user: IUser): Promise<IUser> {
    try {
      const userData = await User.updateOne(
        { _id: user._id },
        { ...user },
        { new: true }
      );

      return userData as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }

  async updateAvatar(imageUrl: string, userId: string): Promise<IUser> {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { avatar: imageUrl },
        { new: true }
      );

      return user as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }

  async activateSubscription(userId: string, amount: number): Promise<IUser> {
    try {
      const loggedInUser = await User.findOne({ _id: userId });
      if (!loggedInUser?.tenant_id)
        throw new CustomError("tenant id not provided", StatusCode.CONFLICT);

      const updateFields = {
        subscriptionStatus: true,
        subscriptionAmount: amount,
      };

      await User.updateMany(
        { tenant_id: loggedInUser?.tenant_id },
        { $set: updateFields }
      );

      const updatedUser = await User.findOne({ _id: userId });

      const subscriptionData: ISubscription = {
        action: "subscribe",
        amount: amount,
        date: new Date(Date.now()).toISOString(),
        orgName: updatedUser?.tenant_id || "",
        userId: updatedUser?._id?.toString() || "",
        status: "active",
      };

      await SubscriptionModel.create(subscriptionData);

      return updatedUser as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }

  async deactivateSubscription(userId: string): Promise<IUser> {
    try {
      const loggedInUser = await User.findOne({ _id: userId });
      if (!loggedInUser?.tenant_id)
        throw new CustomError("tenant id not provided", 409);

      const updateFields = {
        subscriptionStatus: false,
        subscriptionAmount: null,
      };

      await User.updateMany(
        { tenant_id: loggedInUser?.tenant_id },
        { $set: updateFields }
      );

      const updatedUser = await User.findOne({ _id: userId });

      const subscriptionData: ISubscription = {
        action: "cancel",
        amount: 0,
        date: new Date(Date.now()).toISOString(),
        orgName: updatedUser?.tenant_id || "",
        userId: updatedUser?._id?.toString() || "",
        status: "inactive",
      };

      await SubscriptionModel.create(subscriptionData);

      return updatedUser as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionHistory(tenantId: string): Promise<ISubscription[]> {
    try {
      const subscriptionHistory = await SubscriptionModel.find({
        orgName: tenantId,
      }).sort({ createdAt: -1 });

      console.log(tenantId, subscriptionHistory.length);

      return subscriptionHistory as unknown as ISubscription[];
    } catch (error) {
      throw error;
    }
  }

  async getFullSubHistory(): Promise<ISubscription[]> {
    try {
      const subHistory = await SubscriptionModel.find().sort({
        createdAt: -1,
      });

      return subHistory as unknown as ISubscription[];
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionPlans(): Promise<ISubscriptionPlan> {
    try {
      const subscriptionPlans = await SubscriptionPlanModel.findOne();

      return subscriptionPlans as unknown as ISubscriptionPlan;
    } catch (error) {
      throw error;
    }
  }

  async editSubscriptionPlan(
    newPlan: ISubscriptionPlan
  ): Promise<ISubscriptionPlan> {
    try {
      const updatedPlan = await SubscriptionPlanModel.findOneAndUpdate(
        {},
        { $set: newPlan },
        { returnDocument: "after" }
      );

      return updatedPlan as unknown as ISubscriptionPlan;
    } catch (error) {
      throw error;
    }
  }

  generateRandom4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
