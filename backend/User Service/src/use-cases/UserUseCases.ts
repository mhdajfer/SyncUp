import { ObjectId } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserUseCases implements IUserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  createUser(user: IUser) {
    try {

      this.userRepository.createUser(user);
    } catch (error) {}
  }
  getUsers() {
    try {
      this.userRepository.getAllUsers();
    } catch (error) {}
  }
  updateUser(user: IUser) {
    try {
      this.userRepository.updateUser(user);
    } catch (error) {}
  }
  deleteUser(userId: ObjectId) {
    try {
      // this.userRepository.
    } catch (error) {}
  }
}
