import { IUser } from "./IUser";


export interface IUserController{
    findUser(email: string): Promise<IUser>
}