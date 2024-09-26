import { NextFunction, Router, Response, Request } from "express";
import { checkSchema } from "express-validator";
import tenantValidator from "../validator/tenantValidator";
import userAuth from "../../middlewares/userAuth";


const router = Router();

router.post(
  "/tenants",
  userAuth,
  checkSchema(tenantValidator()),
  formValidation,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.createTenant(req, res, next)
);

export default router;
