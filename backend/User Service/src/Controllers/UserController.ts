import { Request, Response, NextFunction } from "express";
import { IUserUseCases } from "../interfaces/IUserUseCases";
import { IUser } from "../interfaces/IUser";
import { validationResult } from "express-validator";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { createToken, verifyAccessToken } from "../Utils/Jwt";
import { KafkaConnection } from "../Config/kafka/kafkaConnection";
import { UserProducer } from "../events/Producers/UserProducer";
import { CustomError } from "../ErrorHandler/CustonError";
import { CustomRequest } from "../interfaces/CustomRequest";
import hashPassword from "../Utils/bcrypt";

export class UserController {
  private userUseCase: IUserUseCases;

  constructor(userUseCases: IUserUseCases) {
    this.userUseCase = userUseCases;
  }

  async createUserForInvitee(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token, password } = req.body;

      const user = verifyAccessToken(token);

      console.log("the user is .....", user, password);

      const userData = await this.userUseCase.getUserByEmail(user.email);

      console.log(userData);

      //  if (!userData) throw new CustomError("user details not found", 400);
      const hashedPassword = await hashPassword(password);

      let data;
      if (!userData?.password)
        data = {
          ...user,
          password: password,
          isVerified: true,
        };
      else
        data = {
          ...userData,
          password: userData?.password ? hashedPassword : password,
          isVerified: true,
        };

      console.log("Before creating the invited user ************", data);

      let response: IUser | null;

      if (!userData?.password)
        response = await this.userUseCase.createUserInvite(data as IUser);
      else response = await this.userUseCase.editProfile(data as IUser);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      if (!userData?.password)
        await userProducer.notifyRegistrationSuccess(response as IUser);
      else
        await userProducer.sendDefaultMessage(
          "user-updated",
          "user-events",
          JSON.stringify(response)
        );

      console.log("user created", response);

      res.json(201).json({
        success: true,
        data: response,
        message: "welcome back",
      });
    } catch (error) {
      next(error);
    }
  }

  //forgot password otp sending
  async verifyAndSendOtp(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      console.log(email);

      const user = await this.userUseCase.getUserByEmail(email);

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User not exist", data: null });

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      const inviteToken = createToken(user);

      await userProducer.inviteUsers(user, inviteToken);

      return res.status(201).json({
        success: true,
        data: user,
        message: "check you mail",
      });
    } catch (error) {
      throw error;
    }
  }

  async inviteUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.body;

      const authUser = req.user;
      if (!authUser) throw new CustomError("tenantAdmin not found", 400);

      const tenantAdmin = await this.userUseCase.getUserByEmail(authUser.email);

      const userData = {
        ...user,
        tenant_id: tenantAdmin?.tenant_id,
      };

      console.log(userData);

      const data = await this.userUseCase.inviteUser(userData);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      const inviteToken = createToken(userData);

      await userProducer.inviteUsers(data, inviteToken);

      return res.status(201).json({
        success: true,
        data,
        message: "added invitee",
      });
    } catch (error) {
      console.log("error", error);

      next(error);
    }
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
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      console.log("verifying otp...", email, otp);

      const verified = await this.userUseCase.verifyOtp(email, otp);

      const user = await this.userUseCase.getUserByEmail(email);

      if (!user) throw new CustomError("user not found", 409);

      if (!verified) throw new CustomError("user not verified", 409);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.notifyRegistrationSuccess(user);

      return res.status(200).json({ success: true, message: "user verified" });
    } catch (error) {
      console.error("Error verifying user:", error);
      next(error);
    }
  }

  async onCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      //req validation
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty())
        return res.json({ success: false, data: null, message: errors });

      const user: IUser = req.body;

      const existingUser = await this.userUseCase.getUserByEmail(user.email);

      if (existingUser) throw new CustomError("user already exists", 409);

      const data = await this.userUseCase.createUser(user);
      if (!data) throw new CustomError("user not verified", 409);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.sendMessage("create", user, data);

      return res
        .status(201)
        .json({ success: true, data, message: `otp send to ${user.email}` });
    } catch (error: any) {
      console.log(error.message);

      if (error.message.includes("user already exists")) {
        return res.json({
          success: false,
          data: null,
          message: "User with the same email or phone number already exists.",
        });
      } else next(error);
    }
  }

  async onGetUserManagerList(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authUser = req.user;
      if (!authUser) throw new CustomError("admin not found", 400);

      const tenantAdmin = await this.userUseCase.getUserByEmail(authUser.email);

      if (!tenantAdmin?.tenant_id) throw new CustomError("No users", 400);

      const managerList = await this.userUseCase.getManagerList(
        tenantAdmin.tenant_id
      );

      console.log("list of managers", managerList);

      return res.status(200).json({ success: true, data: managerList });
    } catch (error) {
      console.error("Error retrieving managers list:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async onGetAllDevelopers(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authUser = req.user;
      if (!authUser) throw new CustomError("admin not found", 400);

      const tenantAdmin = await this.userUseCase.getUserByEmail(authUser.email);

      if (!tenantAdmin?.tenant_id) throw new CustomError("No users", 400);

      const devList = await this.userUseCase.getDevList(tenantAdmin.tenant_id);

      return res.status(200).json({ success: true, data: devList });
    } catch (error) {
      console.error("Error retrieving developer list:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) { 
    try {
      const id = req.params.id;

      const user: IUser = req.body;
      console.log("data : ", id, user);

      const userData = await this.userUseCase.editProfile(user);
      console.log(userData);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      userProducer.sendDefaultMessage(
        "user-updated",
        "user-events",
        JSON.stringify(userData)
      );

      return res.status(200).json({
        success: true,
        data: userData,
        message: "profile updated successfully",
      });
    } catch (error) {
      throw error;
    }
  }

  async onGetUserList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const authUser = req.user;
      if (!authUser) throw new CustomError("admin not found", 400);

      const tenantAdmin = await this.userUseCase.getUserByEmail(authUser.email);

      if (!tenantAdmin?.tenant_id) throw new CustomError("No users", 400);
      const userList = await this.userUseCase.getUsers(tenantAdmin.tenant_id);

      res.status(200).json({
        success: true,
        data: userList,
        message: "retrieved users successfully",
      });
    } catch (error: any) {
      console.log(`Error getting user list : ${error.message}`);
      next(error);
    }
  }
  async onGetUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const user = await this.userUseCase.getUserById(id);

      if (!user) return res.status(404).json({ message: "User not found" });
      res
        .status(200)
        .json({ success: true, data: user, message: "retrieved user details" });
    } catch (error: any) {
      console.log(`Error while retrieving user : ${error.message}`);
    }
  }
  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log("got req inside userLogin", username, password);

      const { user, accessToken, refreshToken } = await this.userUseCase.login(
        username,
        password
      );

      console.log("logged in successfully.....", user);
      return res
        .status(200)
        .json({ user: user, refreshToken, accessToken, success: true });
    } catch (error: any) {
      console.error("Error logging developer:", error);
      next(error);
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
