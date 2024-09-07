import { Request, Response, NextFunction } from "express";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUser } from "../interfaces/IUser";
import { validationResult } from "express-validator";

export class UserController {
  private userUseCase: IUserUseCases;

  constructor(userUseCases: IUserUseCases) {
    this.userUseCase = userUseCases;
  }

  async onCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      //req validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors });

      const user: IUser = req.body;

      const data = await this.userUseCase.createUser(user);

      res.status(201).json(data);
    } catch (error: any) {
      if (error.message === "User already exists") {
        return res.status(400).json({
          message: "User with the same email or phone number already exists.",
        });
      } else {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }
  async onUpdateUser(req: Request, res: Response, next: NextFunction) {}
  async onDeleteUser(req: Request, res: Response, next: NextFunction) {}
  async onGetUser(req: Request, res: Response, next: NextFunction) {
    try {
      const email: string = req.body;

      const data = await this.userUseCase.getUser(email);

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}
