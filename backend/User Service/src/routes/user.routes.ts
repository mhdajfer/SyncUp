import express, { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserController } from "../Controllers/UserController";
import { UserUseCases } from "../use-cases/UserUseCases";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { checkSchema } from "express-validator";
import signupValidator from "../validators/signupValidator";
const router = express.Router();

const userRepository: IUserRepository = new UserRepository();
const userUseCase: IUserUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCase);

router.post(
  "/",
  checkSchema(signupValidator()),
  userController.onCreateUser.bind(userController)
);
router.post("/login", userController.userLogin.bind(userController));
router.post("/verify", userController.isUserLogin.bind(userController));
router.get("/", userController.onGetUserList.bind(userController));
router.get(
  "/pmanagers",
  userController.onGetUserManagerList.bind(userController)
);
router.get("/:id", userController.onGetUser.bind(userController));

export default router;
