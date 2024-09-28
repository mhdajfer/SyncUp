import { CustomError } from "../ErrorHandler/CustonError";
import { CustomRequest } from "../interfaces/CustomRequest";
import { ICreateTenant } from "../interfaces/ITenant";
import { ITenantAdminUseCases } from "../interfaces/ITenantAdminUseCases";

import { NextFunction, Response } from "express";

export class TenantController {
  constructor(private tenantUseCases: ITenantAdminUseCases) {}

  async createTenant(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ICreateTenant = req.body;

      const tenant = req.user;

      if (!tenant) throw new CustomError("NO tenant details", 409);

      const newTenant = await this.tenantUseCases.createTenant(data, tenant);

      return res
        .status(201)
        .json({ success: true, data: "newTenant", message: "Tenant created" });
    } catch (error) {
      next(error);
    }
  }

  async getTenant(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const tenantAdmin = req.user;

      if (!tenantAdmin) throw new CustomError("tenant admin not found", 409);

      const tenant = await this.tenantUseCases.getTenant(tenantAdmin);

      return res
        .status(200)
        .json({
          success: true,
          data: tenant,
          message: "retrieved tenant successfully",
        });
    } catch (error) {
      throw error;
    }
  }
}
