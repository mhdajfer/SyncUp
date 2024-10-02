import { IUser } from "./IUser";

export interface IUserUseCases {
  findUser(email: string): Promise<IUser>;
  updateTenantAdmin(tenantId: string, adminEmail: string): Promise<IUser>;
}
