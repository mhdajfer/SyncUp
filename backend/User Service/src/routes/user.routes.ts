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
const router = express.Router();

const userRepository: IUserRepository = new UserRepository();
const userUseCase: IUserUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCase);

router.post(
  "/",
  checkSchema(signupValidator()),
  userController.onCreateUser.bind(userController)
);
router.post("/verifyOtp", userController.verifyOtp.bind(userController));

router.post("/login", userController.userLogin.bind(userController));

router.post("/invite", userController.inviteUser.bind(userController));
router.post(
  "/setup-password",
  userAuth,
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

export default router;
