import { NextFunction, Router, Response, Request } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../validator/tenantValidator";
import { TenantAdminRepository } from "../repository/TenantAdminRepository";
import { TenantAdminUseCases } from "../use-cases/TenantAdminUseCases";
import { TenantController } from "../Controllers/TenantController";
import userAuth from "../middlewares/userAuth";

const router = Router();

const tenantRepository = new TenantAdminRepository();
const tenantUseCases = new TenantAdminUseCases(tenantRepository);
const tenantController = new TenantController(tenantUseCases);

router.post(
  "/",
  checkSchema(tenantValidator()),
  userAuth,
  tenantController.createTenant.bind(tenantController)
);

router.get("/", userAuth, tenantController.getTenant.bind(tenantController));

export default router;
