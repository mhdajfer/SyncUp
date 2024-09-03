import express, { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
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

router.get("/", userController.onGetUser);
router.post(
  "/",
  checkSchema(signupValidator()),
  userController.onCreateUser.bind(userController)
);
router.post("/delete/:id", userController.onDeleteUser);
router.put("/", userController.onUpdateUser);

export default router;
