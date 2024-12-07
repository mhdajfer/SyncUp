import { NextFunction, Router, Response, Request } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../validator/tenantValidator";
import { TenantAdminRepository } from "../repository";
import { TenantAdminUseCases } from "../use-cases";
import { TenantController } from "../Controllers";
import userAuth from "../middlewares/userAuth";
import { UserRepository } from "../repository";
import { UserUseCases } from "../use-cases";

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

router.put("/", userAuth, tenantController.editTenant.bind(tenantController));

router.get(
  "/all",
  userAuth,
  tenantController.getAllTenants.bind(tenantController)
);

export default router;
