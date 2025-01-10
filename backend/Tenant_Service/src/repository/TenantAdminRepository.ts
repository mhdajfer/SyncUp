import mongoose from "mongoose";
import { CustomError } from "../ErrorHandler/CustonError";
import { Tenant } from "../frameworks/models";
import { ICreateTenant, ITenants, StatusCode } from "../interfaces";
import { ITenantAdminRepository } from "../interfaces";
import { IUser } from "../interfaces";

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

      if (!response)
        throw new CustomError("tenant not created", StatusCode.CONFLICT);

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTenant(tenantAdmin: IUser): Promise<ITenants> {
    try {
      console.log("tenant : ", tenantAdmin._id);
      const user = await Tenant.findOne({
        user_id: tenantAdmin._id,
      });
      console.log(user);

      if (!user)
        throw new CustomError("No tenant found", StatusCode.BAD_REQUEST);

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

  async getAllTenants(): Promise<ITenants[]> {
    try {
      const tenants = await Tenant.find();

      return tenants as ITenants[];
    } catch (error) {
      throw error;
    }
  }
}
