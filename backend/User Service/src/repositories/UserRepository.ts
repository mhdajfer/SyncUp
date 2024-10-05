import { IUser, IUserInvite } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import User from "../frameworks/models/userModel";
import { ObjectId } from "mongodb";
import Otp from "../frameworks/models/otpModel";
import { CustomError } from "../ErrorHandler/CustonError";
import Invitee from "../frameworks/models/inviteeModel";

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
      });

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
    } catch (error: any) {
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
    } catch (error: any) {
      console.log(`Error while getting all users`);

      throw new Error(`Error getting all users: ${error.message}`);
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error("Error creating user in repository: ", error);
      throw error;
    }
  }
  async updateUser(user: IUser): Promise<IUser> {
    try {
      console.log("inside repository", user.tenant_id);

      const response = await User.updateOne(
        { email: user.email },
        { tenant_id: user.tenant_id }
      );

      return response as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }
  async findUser(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email });
      return user?.toObject() as IUser;
    } catch (error: any) {
      throw new Error("error while searching for user: " + error.message);
    }
  }

  generateRandom4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
