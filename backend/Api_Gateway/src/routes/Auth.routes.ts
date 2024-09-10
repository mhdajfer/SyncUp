import express from "express";
import { AuthRepository } from "../Repositories/AuthRepository";
import { AuthUseCases } from "../Use-cases/AuthUseCases";
import { AuthController } from "../Controllers/AuthController";

const router = express.Router();

const authRepository = new AuthRepository();
const authUseCases = new AuthUseCases(authRepository);
const authController = new AuthController(authUseCases);

router.post("/login", authController.userLogin.bind(authController));

export default router;
