import { CustomError } from "../ErrorHandler/CustonError";
import { CustomRequest } from "../interfaces/CustomRequest";
import { ICreateTenant } from "../interfaces/ITenant";
import { ITenantAdminUseCases } from "../interfaces/ITenantAdminUseCases";

import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../interfaces/StatusCode";

export class TenantController {
  constructor(private _tenantUseCases: ITenantAdminUseCases) {}

  async createTenant(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ICreateTenant = req.body;

      const tenant = req.user;

      if (!tenant) throw new CustomError("NO tenant admin details", 409);

      const newTenant = await this._tenantUseCases.createTenant(data, tenant);

      console.log(newTenant);

      return res
        .status(StatusCode.CREATED)
        .json({ success: true, data: "newTenant", message: "Tenant created" });
    } catch (error) {
      next(error);
    }
  }

  async getTenant(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const tenantAdmin = req.user;

      console.log("user", tenantAdmin);

      if (!tenantAdmin) throw new CustomError("tenant admin not found", 409);

      const tenant = await this._tenantUseCases.getTenant(tenantAdmin);

      return res.status(StatusCode.OK).json({
        success: true,
        data: tenant,
        message: "retrieved tenant successfully",
      });
    } catch (error) {
      console.log("controller************");
      next(error);
    }
  }

  async getAllTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this._tenantUseCases.getAllTenants();

      return res
        .status(StatusCode.OK)
        .json({
          success: true,
          message: "Tenants retrieved successfully",
          data: tenants,
        });
    } catch (error) {
      console.log("Error while getting all tenants", error);
      next(error);
    }
  }

  async editTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantData } = req.body;

      console.log(tenantData);

      const data = await this._tenantUseCases.editTenant(tenantData);

      return res
        .status(StatusCode.OK)
        .json({ success: true, data, message: "tenant updated successfully" });
    } catch (error) {
      console.log("error while updating tenant", error);

      next(error);
    }
  }
}
