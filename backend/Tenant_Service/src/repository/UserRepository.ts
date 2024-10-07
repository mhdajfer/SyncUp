import { CustomError } from "../ErrorHandler/CustonError";
import User from "../frameworks/models/userModel";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  async findUser(email: string): Promise<IUser> {
    try {
      const user = await User.findOne({ email });

      if (!user) throw new CustomError("User not found", 409);

      return user.toObject() as IUser;
    } catch (error) {
      throw error;
    }
  }

  async updateTenantAdmin(tenantId: string, adminEmail: string) {
    try {
      const user = await User.findOneAndUpdate(
        { email: adminEmail },
        { tenant_id: tenantId },
        { new: true }
      );

      return user as IUser;
    } catch (error) {
      throw error;
    }
  }


}
