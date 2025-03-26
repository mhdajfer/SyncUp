import { ICreateTenant, ITenants, IUser } from "../../Shared/interfaces";


export interface ITenantAdminUseCases {
  createTenant(data: ICreateTenant, tenant: IUser): Promise<ITenants>;
  getTenant(tenantAdmin: IUser): Promise<ITenants>;
  editTenant(data: ITenants): Promise<ITenants>;
  getAllTenants(): Promise<ITenants[]>;
}
