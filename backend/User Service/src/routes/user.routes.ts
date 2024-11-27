import express, { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserController } from "../Controllers/UserController";
import { UserUseCases } from "../use-cases/UserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { checkSchema } from "express-validator";
import signupValidator from "../validators/signupValidator";
import userAuth from "../Middlewares/userAuth";
import authRefresh from "../Middlewares/authRefresh";
import { PaymentController } from "../Controllers/PaymentController";
const router = express.Router();

const userRepository: IUserRepository = new UserRepository();
const userUseCase: IUserUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCase);

const paymentController = new PaymentController();
router.get(
  "/allTenants",
  userAuth,
  userController.getAllTenantAdmins.bind(userController)
);

router.post(
  "/",
  checkSchema(signupValidator()),
  userController.onCreateUser.bind(userController)
);
router.post("/verifyOtp", userController.verifyOtp.bind(userController));

router.post("/login", userController.userLogin.bind(userController));

router.post(
  "/invite",
  userAuth,
  userController.inviteUser.bind(userController)
);
router.post(
  "/setup-password",
  userController.createUserForInvitee.bind(userController)
);

router.post("/otp/new", userController.createNewOtp.bind(userController));
router.post(
  "/verify",
  authRefresh,
  userController.isUserLogin.bind(userController)
);
router.get("/", userAuth, userController.onGetUserList.bind(userController));
router.get(
  "/pmanagers",
  userAuth,
  userController.onGetUserManagerList.bind(userController)
);
router.post("/block", userAuth, userController.blockUser.bind(userController));
router.get(
  "/developers",
  userAuth,
  userController.onGetAllDevelopers.bind(userController)
);
router.get("/:id", userAuth, userController.onGetUser.bind(userController));
router.put("/:id", userAuth, userController.editProfile.bind(userController));

router.post(
  "/forgot-password",
  userController.verifyAndSendOtp.bind(userController)
);
router.get(
  "/upload/image",
  userAuth,
  userController.generateUploadUrl.bind(userController)
);

router.post("/google-auth", userController.googleSignup.bind(userController));
router.post(
  "/create-intent",
  paymentController.createPaymentIntent.bind(paymentController)
);

router.post(
  "/update-subscription",
  userAuth,
  userController.activateSubscription.bind(userController)
);

router.post(
  "/remove-subscription",
  userAuth,
  userController.deactivateSubscription.bind(userController)
);

router.post(
  "/history-subscription",
  userAuth,
  userController.getSubscriptionHistory.bind(userController)
);

router.post(
  "/history-subscription/sAdmin",
  userAuth,
  userController.getFullSubHistory.bind(userController)
);

router.post(
  "/plan",
  userAuth,
  userController.getSubscriptionPlans.bind(userController)
);

router.post(
  "/plan/edit",
  userAuth,
  userController.editSubscriptionPlan.bind(userController)
);

export default router;
