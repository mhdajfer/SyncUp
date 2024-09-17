import { Request, Response, NextFunction } from "express";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUser } from "../interfaces/IUser";
import { validationResult } from "express-validator";
import { addAbortListener } from "events";

export class UserController {
  private userUseCase: IUserUseCases;

  constructor(userUseCases: IUserUseCases) {
    this.userUseCase = userUseCases;
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      const result = await this.userUseCase.blockUser(userId);
      const message = result.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully";

      return res.status(200).json({
        success: true,
        data: result,
        message: message,
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async onCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      //req validation
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({ success: false, data: null, message: errors });

      const user: IUser = req.body;

      const data = await this.userUseCase.createUser(user);

      return res
        .status(201)
        .json({ success: true, data, message: "user created successfully" });
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

  async onGetUserManagerList(req: Request, res: Response, next: NextFunction) {
    try {
      const managerList = await this.userUseCase.getManagerList();

      console.log("list of managers", managerList);

      return res.status(200).json({ success: true, data: managerList });
    } catch (error) {
      console.error("Error retrieving managers list:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async onGetAllDevelopers(req: Request, res: Response, next: NextFunction) {
    try {
      const devList = await this.userUseCase.getDevList();

      return res.status(200).json({ success: true, data: devList });
    } catch (error) {
      console.error("Error retrieving developer list:", error);
      return res.status(500).json({ message: "Internal server error" });
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
  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log("got req inside userLogin", username, password);

      const { user, accessToken, refreshToken } = await this.userUseCase.login({
        username,
        password,
      });

      console.log("logged in successfully.....", user);
      return res
        .status(200)
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json({ user: user, accessToken, success: true });
    } catch (error) {
      console.error("Error logging developer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async isUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.cookies.refresh_token;

      const user = await this.userUseCase.verifyUser(token);

      res.status(200).json({ user });
    } catch (error: any) {
      console.log(`Error while login: ${error}`);
      return res
        .status(400)
        .json({ message: "Error while Login", error: error.message });
    }
  }
}
