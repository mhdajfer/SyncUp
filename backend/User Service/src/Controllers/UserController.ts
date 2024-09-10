import { Request, Response, NextFunction } from "express";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUser } from "../interfaces/IUser";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import mongoose, { ObjectId } from "mongoose";

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
  async onGetUserList(req: Request, res: Response, next: NextFunction) {
    try {
      const userList = await this.userUseCase.getUsers();

      res.status(200).json(userList);
    } catch (error: any) {
      console.log(`Error getting user list : ${error.message}`);
    }
  }
  async onUpdateUser(req: Request, res: Response, next: NextFunction) {}
  async onDeleteUser(req: Request, res: Response, next: NextFunction) {}
  async onGetUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const user = await this.userUseCase.getUserById(id);

      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ user });

      //res.status(201).json(data);
    } catch (error: any) {
      console.log(`Error while retrieving user : ${error.message}`);
    }
  }
  async devLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log("got req inside devLogin", username, password);

      const user = await this.userUseCase.getUserByEmail(username);

      if (!user) return res.status(401).json({ error: "User not exists.." });

      const resObj = await bcrypt.compare(password, user.password);

      if (!resObj) return res.status(401).json({ error: "Invalid password" });

      console.log("logged in successfully.....", user);
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error logging developer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
