import { CustomError } from "../ErrorHandler/CustonError";
import User from "../frameworks/models/userModel";
import { IConsumerRepository } from "../interfaces/IConsumerRepository";
import { IUser } from "../interfaces/IUser";

export class ConsumerRepository implements IConsumerRepository {
  async createUser(data: IUser): Promise<IUser> {
    try {
      const newData = new User(data);

      const newUser = await newData.save();

      if (!newUser)
        throw new CustomError("user not created in tenant service", 409);

      return newUser.toObject() as IUser;
    } catch (error: any) {
      console.log("Error in Consumer Repository: " + error.message);
      throw error;
    }
  }

  async updateUser(user: IUser): Promise<IUser> {
    try {
      console.log("inside repository", user.tenant_id);

      const response = await User.updateOne({ email: user.email }, { ...user });

      return response as unknown as IUser;
    } catch (error) {
      throw error;
    }
  }
}
