import { Request, Response, NextFunction } from "express";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUser } from "../interfaces/IUser";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { createToken } from "../Utils/Jwt";
import { KafkaConnection } from "../Config/kafka/kafkaConnection";
import { UserProducer } from "../events/Producers/UserProducer";

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

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      console.log("verifying otp...", email, otp);

      const verified = await this.userUseCase.verifyOtp(email, otp);

      if (verified)
        return res
          .status(200)
          .json({ success: true, message: "user verified" });
      else
        return res
          .status(400)
          .json({ success: false, message: "user not verified" });
    } catch (error) {
      console.error("Error blocking user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async onCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      //req validation
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty())
        return res.json({ success: false, data: null, message: errors });

      const { userData: user, useCase }: { userData: IUser; useCase: string } =
        req.body;

      console.log(req.body);

      let data;
      if (useCase) {
        data = await this.userUseCase.createUserInvite(user);
        if (!data)
          return res.json({ success: false, message: "user not created" });
      } else {
        const user: IUser = req.body;
        data = await this.userUseCase.createUser(user);
        if (!data)
          return res.json({
            success: false,
            data,
            message: "user not verified",
          });

        const kafkaConnection = new KafkaConnection();
        const producer = await kafkaConnection.getProducerInstance();
        const userProducer = new UserProducer(producer);

        await userProducer.sendMessage("create", user, data);
      }

      return res
        .status(201)
        .json({ success: true, data, message: "user created successfully" });
    } catch (error: any) {
      console.log(error.message);

      if (error.message.includes("User already exists")) {
        return res.json({
          success: false,
          data: null,
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
        .json({ user: user, refreshToken, accessToken, success: true });
    } catch (error: any) {
      console.error("Error logging developer:", error);
      if (error.message.includes("not exist"))
        return res.json({ success: false, message: error.message, data: null });
      else if (error.message.includes("Incorrect password"))
        return res.json({ success: false, message: error.message, data: null });
      return res.status(500).json({ message: error.message });
    }
  }

  async isUserLogin(
    req: Request & Partial<{ user: IUser | jwt.JwtPayload }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      let user = req.user;
      console.log("creating new token for : ", user?.email);

      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "User not found", data: null });

      delete user.__v;
      delete user.iat;
      delete user.exp;

      const newAccessToken = createToken(user as IUser);
      console.log("sending new access token......");

      res.status(200).json({
        success: true,
        newAccessToken,
        message: "created new access token",
      });
    } catch (error: any) {
      console.log(`Error while login: ${error}`);
      return res
        .status(400)
        .json({ message: "Error while Login", error: error.message });
    }
  }

  async createNewOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const { isOtpSend, user, otp } = await this.userUseCase.createNewOtp(
        email
      );

      if (!isOtpSend)
        return res.json({ success: false, message: "error sending new otp" });

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.sendMessage("create", user, otp);

      return res
        .status(201)
        .json({ success: true, user, message: "user created successfully" });
    } catch (error: any) {
      console.log(`Error while login: ${error}`);
      return res
        .status(400)
        .json({ message: "Error while Login", error: error.message });
    }
  }
}
