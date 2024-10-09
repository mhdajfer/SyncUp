import { CustomError } from "../ErrorHandler/CustonError";
import Tenant from "../frameworks/models/tenantModel";
import { ICreateTenant, ITenants } from "../interfaces/ITenant";
import { ITenantAdmin } from "../interfaces/ITenantAdmin";
import { ITenantAdminRepository } from "../interfaces/ITenantAdminRepository";
import { IUser } from "../interfaces/IUser";

export class TenantAdminRepository implements ITenantAdminRepository {
  async createTenant(data: ICreateTenant, tenant: IUser): Promise<ITenants> {
    try {
      const timestamp = Date.now();

      const companyNameSlug = data.company_name
        .replace(/\s+/g, "")
        .toLowerCase();

      const tenant_id = `${companyNameSlug}-${timestamp}`;

      const newData = new Tenant({ ...data, user_id: tenant._id, tenant_id });

      const response: ITenants = await newData.save();

      if (!response) throw new CustomError("tenant not created", 409);

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTenant(tenantAdmin: IUser): Promise<ITenants> {
    try {
      const user = await Tenant.findOne({ user_id: tenantAdmin._id });

      if (!user) throw new CustomError("No tenant admin found", 400);

      return user as unknown as ITenants;
    } catch (error) {
      throw error;
    }
  }

  async editTenant(data: ITenants): Promise<ITenants> {
    try {
      const tenantData = await Tenant.findOneAndUpdate(
        { _id: data._id },
        { ...data },
        { new: true }
      );

      return tenantData as unknown as ITenants;
    } catch (error) {
      throw error;
    }
  }
}
