import { IUser } from "../../Shared/interfaces";


export interface IUserUseCases {
  findUser(email: string): Promise<IUser>;
  updateTenantAdmin(tenantId: string, adminEmail: string): Promise<IUser>;
  
}
