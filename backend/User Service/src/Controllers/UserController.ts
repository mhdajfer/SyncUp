import { Request, Response, NextFunction } from "express";
import { IUserUseCases } from "../interfaces";
import { googleUser, IUser } from "../interfaces";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { createToken, verifyAccessToken } from "../Utils/Jwt";
import { KafkaConnection } from "../Config/kafka/kafkaConnection";
import { UserProducer } from "../events/Producers/UserProducer";
import { CustomError } from "../ErrorHandler/CustonError";
import { CustomRequest } from "../interfaces";
import hashPassword from "../Utils/bcrypt";
import { StatusCode } from "../interfaces/StatusCode";
import { getUploadSignedUrl } from "../Utils/S3";

export class UserController {
  private _userUseCase: IUserUseCases;

  constructor(userUseCases: IUserUseCases) {
    this._userUseCase = userUseCases;
  }

  async createUserForInvitee(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, password } = req.body;

      const user = verifyAccessToken(token);

      console.log("the user is .....", user, password);

      const userData = await this._userUseCase.getUserByEmail(user.email);

      console.log(userData);

      //  if (!userData) throw new CustomError("user details not found", StatusCode.BAD_REQUEST);
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
        response = await this._userUseCase.createUserInvite(data as IUser);
      else response = await this._userUseCase.editProfile(data as IUser);

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

      res.json(StatusCode.CREATED).json({
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
  ): Promise<void> {
    try {
      const { email } = req.body;

      console.log(email);

      const user = await this._userUseCase.getUserByEmail(email);

      if (!user)
        throw new CustomError("User not exist", StatusCode.BAD_REQUEST);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      const inviteToken = createToken(user);

      await userProducer.inviteUsers(user, inviteToken);

      res.status(StatusCode.CREATED).json({
        success: true,
        data: user,
        message: "check you mail",
      });
    } catch (error) {
      throw error;
    }
  }

  async inviteUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.body;

      const authUser = req.user;
      if (!authUser)
        throw new CustomError("tenantAdmin not found", StatusCode.BAD_REQUEST);

      const tenantAdmin = await this._userUseCase.getUserByEmail(
        authUser.email
      );

      const userData = {
        ...user,
        tenant_id: tenantAdmin?.tenant_id,
      };

      console.log(userData);

      const data = await this._userUseCase.inviteUser(userData);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      const inviteToken = createToken(userData);

      await userProducer.inviteUsers(data, inviteToken);

      res.status(StatusCode.CREATED).json({
        success: true,
        data,
        message: "added invitee",
      });
    } catch (error) {
      console.log("error", error);

      next(error);
    }
  }

  async blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.body;

      const result = await this._userUseCase.blockUser(userId);
      const message = result.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully";

      res.status(StatusCode.OK).json({
        success: true,
        data: result,
        message: message,
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log("verifying otp...", email, otp);

      const verified = await this._userUseCase.verifyOtp(email, otp);

      const user = await this._userUseCase.getUserByEmail(email);

      if (!user) throw new CustomError("user not found", StatusCode.CONFLICT);

      if (!verified)
        throw new CustomError("user not verified", StatusCode.CONFLICT);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.notifyRegistrationSuccess(user);

      res
        .status(StatusCode.OK)
        .json({ success: true, message: "user verified" });
    } catch (error) {
      console.error("Error verifying user:", error);
      next(error);
    }
  }

  async googleSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userDetails: googleUser = req.body;

      const userData: IUser = {
        firstName: userDetails.name,
        lastName: "nil",
        age: 20,
        email: userDetails.email,
        password: userDetails.email.slice(0, 5) + 123,
        avatar: userDetails.image,
        subscriptionStatus: false,
      };

      console.log("userdata", userData);

      const existingUser = await this._userUseCase.getUserByEmail(
        userData.email
      );

      console.log("existingUser", existingUser);

      let data;

      if (!existingUser) {
        data = await this._userUseCase.createUser({
          ...userData,
          isVerified: true,
        });
        console.log("createdUser", data);

        if (!data)
          throw new CustomError("user not created", StatusCode.CONFLICT);

        const kafkaConnection = new KafkaConnection();
        const producer = await kafkaConnection.getProducerInstance();
        const userProducer = new UserProducer(producer);

        await userProducer.sendMessage(
          "create",
          { ...userData, isVerified: true },
          data
        );
        await userProducer.notifyRegistrationSuccess({
          ...userData,
          isVerified: true,
        });
      }

      const { user, accessToken, refreshToken } = await this._userUseCase.login(
        userDetails.email,
        userDetails.email.slice(0, 5) + 123,
        "google"
      );

      console.log("logged in successfully.....", user);
      res
        .status(StatusCode.OK)
        .json({ user: user, refreshToken, accessToken, success: true });
    } catch (error) {
      console.log("error while signing up with google", error);
      next(error);
    }
  }

  async onCreateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //req validation
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty())
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, data: null, message: errors });

      const user: IUser = req.body;

      const existingUser = await this._userUseCase.getUserByEmail(user.email);

      if (existingUser)
        throw new CustomError("user already exists", StatusCode.CONFLICT);

      const data = await this._userUseCase.createUser(user);
      if (!data)
        throw new CustomError("user not verified", StatusCode.CONFLICT);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.sendMessage("create", user, data);

      res
        .status(StatusCode.OK)
        .json({ success: true, data, message: `otp send to ${user.email}` });
    } catch (error: any) {
      console.log(error.message);

      if (error.message.includes("user already exists")) {
        res.json({
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
  ): Promise<void> {
    try {
      const authUser = req.user;
      if (!authUser)
        throw new CustomError("admin not found", StatusCode.BAD_REQUEST);

      const tenantAdmin = await this._userUseCase.getUserByEmail(
        authUser.email
      );

      if (!tenantAdmin?.tenant_id)
        throw new CustomError("No users", StatusCode.BAD_REQUEST);

      const managerList = await this._userUseCase.getManagerList(
        tenantAdmin.tenant_id
      );

      console.log("list of managers", managerList);

      res.status(StatusCode.OK).json({ success: true, data: managerList });
    } catch (error) {
      console.error("Error retrieving managers list:", error);
      next(error);
    }
  }

  async onGetAllDevelopers(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authUser = req.user;
      if (!authUser)
        throw new CustomError("admin not found", StatusCode.BAD_REQUEST);

      const tenantAdmin = await this._userUseCase.getUserByEmail(
        authUser.email
      );

      if (!tenantAdmin?.tenant_id)
        throw new CustomError("No users", StatusCode.BAD_REQUEST);

      const devList = await this._userUseCase.getDevList(tenantAdmin.tenant_id);

      res.status(StatusCode.OK).json({ success: true, data: devList });
    } catch (error) {
      console.error("Error retrieving developer list:", error);
      next(error);
    }
  }

  async getAllTenantAdmins(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this._userUseCase.getAllTenantAdmins();

      res.status(StatusCode.OK).json({
        success: true,
        message: "users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.log("Error while retrieving tenant admins ", error);
      next(error);
    }
  }

  async editProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;

      const user: IUser = req.body;
      console.log("data : ", id, user);

      const userData = await this._userUseCase.editProfile(user);
      console.log(userData);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      userProducer.sendDefaultMessage(
        "user-updated",
        "user-events",
        JSON.stringify(userData)
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: userData,
        message: "profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async onGetUserList(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authUser = req.user;
      if (!authUser)
        throw new CustomError("admin not found", StatusCode.BAD_REQUEST);

      const tenantAdmin = await this._userUseCase.getUserByEmail(
        authUser.email
      );

      if (!tenantAdmin?.tenant_id)
        throw new CustomError("No users", StatusCode.BAD_REQUEST);
      const userList = await this._userUseCase.getUsers(tenantAdmin.tenant_id);

      res.status(StatusCode.OK).json({
        success: true,
        data: userList,
        message: "retrieved users successfully",
      });
    } catch (error) {
      console.log(`Error getting user list : ${error}`);
      next(error);
    }
  }
  async onGetUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;

      const user = await this._userUseCase.getUserById(id);

      if (!user)
        res.status(StatusCode.NOT_FOUND).json({ message: "User not found" });
      res
        .status(StatusCode.OK)
        .json({ success: true, data: user, message: "retrieved user details" });
    } catch (error) {
      console.log(`Error while retrieving user : ${error}`);
      next(error);
    }
  }
  async userLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, password } = req.body;
      console.log("got req inside userLogin", username, password);

      const { user, accessToken, refreshToken } = await this._userUseCase.login(
        username,
        password
      );

      console.log("logged in successfully.....", user);
      res
        .status(StatusCode.OK)
        .json({ user: user, refreshToken, accessToken, success: true });
    } catch (error) {
      console.error("Error logging developer:", error);
      next(error);
    }
  }

  async isUserLogin(
    req: Request & Partial<{ user: IUser | jwt.JwtPayload }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let user = req.user;
      console.log("creating new token for : ", user?.email);

      if (!user)
        throw new CustomError("user not found", StatusCode.UNAUTHORIZED);

      delete user.__v;
      delete user.iat;
      delete user.exp;

      const newAccessToken = createToken(user as IUser);
      console.log("sending new access token......");

      res.status(StatusCode.OK).json({
        success: true,
        newAccessToken,
        message: "created new access token",
      });
    } catch (error) {
      console.log(`Error while login: ${error}`);
      next(error);
    }
  }

  async createNewOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      const { isOtpSend, user, otp } = await this._userUseCase.createNewOtp(
        email
      );

      if (!isOtpSend)
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, message: "error sending new otp" });

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      await userProducer.sendMessage("create", user, otp);

      res
        .status(StatusCode.CREATED)
        .json({ success: true, user, message: "user created successfully" });
    } catch (error) {
      console.log(`Error while login: ${error}`);
      next(error);
    }
  }

  async generateUploadUrl(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fileName, fileType }: { fileName: string; fileType: string } =
        req.body;

      if (!req.user?._id)
        throw new CustomError("user not found", StatusCode.UNAUTHORIZED);

      const currentUser = await this._userUseCase.getUserByEmail(
        req.user.email
      );
      if (!currentUser)
        throw new CustomError("user not found", StatusCode.UNAUTHORIZED);

      const uploadUrl = await getUploadSignedUrl(fileName, fileType);

      res.status(StatusCode.OK).json({
        success: true,
        message: "upload url configured correctly",
        uploadUrl,
      });
    } catch (error) {
      console.log("Error while upload url:", error);
      next(error);
    }
  }

  async activateSubscription(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      const { amount } = req.body;

      const updatedUser = await this._userUseCase.activateSubscription(
        user?._id || "",
        amount
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Updated subscription",
        data: updatedUser,
      });
    } catch (error) {
      console.log("Error while activating subscription ");
      next(error);
    }
  }

  async deactivateSubscription(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;

      if (!user?._id)
        throw new CustomError("user not found", StatusCode.UNAUTHORIZED);

      const updatedUser = await this._userUseCase.deactivateSubscription(
        user._id
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "removed subscription",
        data: updatedUser,
      });
    } catch (error) {
      console.log("Error while deactivating subscription ");
      next(error);
    }
  }

  async getSubscriptionHistory(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this._userUseCase.getUserByEmail(
        req.user?.email as string
      );
      const tenantId = user?.tenant_id;

      if (!tenantId)
        throw new CustomError("no tenant_id provided", StatusCode.CONFLICT);

      const historyList = await this._userUseCase.getSubscriptionHistory(
        tenantId
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "subscription history retrieved successfully",
        data: historyList,
      });
    } catch (error) {
      console.log("Error while getting subscription history");
      next(error);
    }
  }

  async getFullSubHistory(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const historyList = await this._userUseCase.getFullSubHistory();

      res.status(StatusCode.OK).json({
        success: true,
        message: "subscription history retrieved successfully",
        data: historyList,
      });
    } catch (error) {
      console.log("Error while getting subscription history");
      next(error);
    }
  }

  async getSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subscriptionPlans = await this._userUseCase.getSubscriptionPlans();

      res.status(StatusCode.OK).json({
        success: true,
        message: "plans retrieved successfully",
        data: subscriptionPlans,
      });
    } catch (error) {
      console.log("Error while getting subscription plans");
      next(error);
    }
  }

  async editSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { newPlan } = req.body;

      const updatedPlan = await this._userUseCase.editSubscriptionPlan(newPlan);

      console.log("new plan updated", updatedPlan);

      res
        .status(StatusCode.OK)
        .json({ success: true, message: "updated Plan", data: updatedPlan });
    } catch (error) {
      console.log("Error while editing subscription");
      next(error);
    }
  }

  private _generateRandomNumber(
    min: number = 10000,
    max: number = 99999
  ): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
