import User from "../Framework/models/user";
import { IAuthRepository } from "../Interfaces/IAuthRepository";
import { IUser } from "../Interfaces/IUser";

export class AuthRepository implements IAuthRepository {
  async findUser(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email });
      return user?.toObject() as IUser;
    } catch (error: any) {
      throw new Error("error while searching for user: " + error.message);
    }
  }
}
