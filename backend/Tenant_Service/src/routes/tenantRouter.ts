import { NextFunction, Router, Response, Request } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../validator/tenantValidator";
import { TenantAdminRepository } from "../repository/TenantAdminRepository";
import { TenantAdminUseCases } from "../use-cases/TenantUseCases";
import { TenantController } from "../Controllers/TenantController";
import userAuth from "../middlewares/userAuth";
import { UserRepository } from "../repository/UserRepository";
import { UserUseCases } from "../use-cases/UserUseCases";

const router = Router();

const userRepository = new UserRepository();
const userUseCases = new UserUseCases(userRepository);

const tenantRepository = new TenantAdminRepository();
const tenantUseCases = new TenantAdminUseCases(tenantRepository, userUseCases);
const tenantController = new TenantController(tenantUseCases);

router.post(
  "/",
  checkSchema(tenantValidator()),
  userAuth,
  tenantController.createTenant.bind(tenantController)
);

router.get("/", userAuth, tenantController.getTenant.bind(tenantController));

export default router;
