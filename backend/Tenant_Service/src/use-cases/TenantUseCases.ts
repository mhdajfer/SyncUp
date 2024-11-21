import { ICreateTenant, ITenants } from "../interfaces/ITenant";
import { ITenantAdmin } from "../interfaces/ITenantAdmin";
import { ITenantAdminRepository } from "../interfaces/ITenantAdminRepository";
import { ITenantAdminUseCases } from "../interfaces/ITenantAdminUseCases";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/IUser";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { CustomError } from "../ErrorHandler/CustonError";

export class TenantAdminUseCases implements ITenantAdminUseCases {
  constructor(
    private tenantAdminRepository: ITenantAdminRepository,
    private userUseCases: IUserUseCases
  ) {}
  async getTenant(tenantAdmin: IUser): Promise<ITenants> {
    try {
      const tenant = await this.tenantAdminRepository.getTenant(tenantAdmin);

      return tenant;
    } catch (error) {
      console.log("use cases************");
      throw error;
    }
  }

  async createTenant(data: ICreateTenant, tenant: IUser): Promise<ITenants> {
    try {
      const response = await this.tenantAdminRepository.createTenant(
        data,
        tenant
      );

      await this.userUseCases.updateTenantAdmin(
        response.tenant_id,
        tenant.email
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async editTenant(data: ITenants): Promise<ITenants> {
    try {
      const tenantData = await this.tenantAdminRepository.editTenant(data);

      if (!tenantData) throw new CustomError("tenant not updated", 409);

      return tenantData;
    } catch (error) {
      throw error;
    }
  }

  async getAllTenants(): Promise<ITenants[]> {
    try {
      const tenants = await this.tenantAdminRepository.getAllTenants();

      return tenants;
    } catch (error) {
      throw error;
    }
  }
}
