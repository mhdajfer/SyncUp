import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  getAllUsers(): Promise<IUser[]> {
    throw new Error("Method not implemented.");
  }
  createUser(user: IUser): Promise<IUser> {
    console.log(user);

    throw new Error(" Method not implemented.");
  }
  updateUser(user: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  findUser(user: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
}
