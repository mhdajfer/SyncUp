import { ICreateTenant, ITenants } from "./ITenant";
import { ITenantAdmin } from "./ITenantAdmin";
import { IUser } from "./IUser";

export interface IUserRepository {
  findUser(email: string): Promise<IUser>;
  updateTenantAdmin(tenantId: string, adminId: string): Promise<IUser>;
  
}
