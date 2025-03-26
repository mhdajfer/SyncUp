import { IUser } from "../../Shared/interfaces";


export interface IUserRepository {
  findUser(email: string): Promise<IUser>;
  updateTenantAdmin(tenantId: string, adminId: string): Promise<IUser>;
  
}
