import { NextFunction, Router, Response, Request } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../../Shared/validator/tenantValidator";
import { TenantAdminRepository } from "../../Infrastructure/repository";
import { TenantAdminUseCases } from "../../Application/use-cases";
import { TenantController } from "../Controllers";
import userAuth from "../middlewares/userAuth";
import { UserRepository } from "../../Infrastructure/repository";
import { UserUseCases } from "../../Application/use-cases";

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
