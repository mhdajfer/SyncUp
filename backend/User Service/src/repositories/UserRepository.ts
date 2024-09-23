import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import User from "../frameworks/models/userModel";
import { ObjectId } from "mongodb";
import Otp from "../frameworks/models/otpModel";

export class UserRepository implements IUserRepository {
  async createNewOtp(email: string): Promise<Boolean> {
    try {
      const otp = this.generateRandom4DigitNumber();
      console.log("created new otp  : ", otp);

      const newOtpData = new Otp({ email, otp });

      const data = await newOtpData.save();

      if (data) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }
  async verifyOtp(email: string, otp: number): Promise<Boolean> {
    try {
      const user: { email: string; otp: number } | null = await Otp.findOne({
        email,
      });

      if (!user) return false;

      if (user.otp == otp) {
        return true;
      } else return false;
    } catch (error) {
      throw error;
    }
  }
  async blockUser(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
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
  s: any;
  async findDevList(): Promise<IUser[]> {
    try {
      const devList: IUser[] = await User.find({ role: "dev" });

      return devList;
    } catch (error) {
      throw error;
    }
  }
  async findManagerList(): Promise<IUser[]> {
    try {
      const managerList: IUser[] = await User.find({ role: "pManager" });

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
  async getAllUsers(): Promise<IUser[]> {
    try {
      interface user extends IUser {
        _id: ObjectId;
      }
      const userList: user[] = await User.find();

      return userList;
    } catch (error: any) {
      console.log(`Error while getting all users`);

      throw new Error(`Error getting all users: ${error.message}`);
    }
  }
  async createUser(user: IUser): Promise<Number> {
    try {
      console.log(user);

      console.log("creating new user .....");

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
  updateUser(user: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
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
