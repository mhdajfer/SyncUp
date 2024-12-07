import { CustomError } from "../ErrorHandler/CustonError";
import { User } from "../frameworks/models";
import { IConsumerRepository, StatusCode } from "../interfaces";
import { IUser } from "../interfaces";

export class ConsumerRepository implements IConsumerRepository {
  async createUser(data: IUser): Promise<IUser> {
    try {
      const newData = new User(data);

      const newUser = await newData.save();

      if (!newUser)
        throw new CustomError("user not created in tenant service", StatusCode.CONFLICT);

      return newUser.toObject() as IUser;
    } catch (error) {
      console.log("Error in Consumer Repository: " + error);
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
