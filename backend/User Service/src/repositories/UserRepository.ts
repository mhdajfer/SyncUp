import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import User from "../frameworks/models/userModel";

export class UserRepository implements IUserRepository {
  getAllUsers(): Promise<IUser[]> {
    throw new Error("getAllUsers not implemented.");
  }
  async createUser(user: IUser): Promise<IUser> {
    try {
      console.log(user);

      console.log("creating new user .....");

      const newUser = new User(user);
      await newUser.save();

      return newUser.toObject() as IUser;
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
}
