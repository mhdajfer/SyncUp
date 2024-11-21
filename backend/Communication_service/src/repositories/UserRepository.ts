import { CustomError } from "../ErrorHandler/CustonError";
import User from "../frameworks/models/userModel";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  async updateUser(user: IUser): Promise<IUser> {
    try {
      console.log("before update user : ---", user);
      console.log("inside repository", user.tenant_id);
      delete user._id;

      const response = await User.updateMany(
        { email: user.email },
        { ...user }
      );

      console.log(response);

      return response as unknown as IUser;
    } catch (error) {
      console.log("reached repository", error);

      throw new CustomError("issue with db", 409);
    }
  }

  async createUser(data: IUser): Promise<IUser> {
    try {
      const newData = new User(data);

      const newUser = await newData.save();

      if (!newUser)
        throw new CustomError("user not created in tenant service", 409);

      return newUser.toObject() as IUser;
    } catch (error: any) {
      console.log("Error in Consumer Repository: " + error.message);
      throw new CustomError("issue with db", 409);
    }
  }
}
