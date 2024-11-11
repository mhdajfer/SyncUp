import { IUser } from "./IUser";



export interface IUserUseCases{
    updateUser(user: IUser): Promise<IUser>;
    createUser(user: IUser): Promise<IUser>;
}