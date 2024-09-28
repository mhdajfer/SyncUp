import { IUser } from "../IUser";

export interface IConsumerUseCases {
  createUser(data: IUser):Promise<IUser>
}
