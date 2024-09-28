import { ICreateTenant, ITenants } from "./ITenant";
import { ITenantAdmin } from "./ITenantAdmin";
import { IUser } from "./IUser";

export interface ITenantAdminRepository {
  createTenant(data: ICreateTenant, tenant: IUser): Promise<ITenants>;
  getTenant(tenantAdmin: IUser): Promise<ITenants>;
}
