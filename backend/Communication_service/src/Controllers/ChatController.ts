import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../interfaces/CustomRequest";
import { CustomError } from "../ErrorHandler/CustonError";
import { IChatUseCases } from "../interfaces/IChatUseCases";
import { StatusCode } from "../Interfaces/StatusCode";

export class ChatController {
  constructor(private chatUseCases: IChatUseCases) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.chatUseCases.getAllUsers();

      return res.status(StatusCode.OK).json({
        success: true,
        message: "successfully retrieved all users",
        data: users,
      });
    } catch (error) {
      console.log("Error while getting users", error);
      next(error);
    }
  }

  async getOneChat(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const userId1 = req.user?._id;
      const userId2 = req.body.userId;
      console.log(userId1, userId2);

      if (!userId1 || !userId2)
        throw new CustomError("any of the user not found", 409);

      const chat = await this.chatUseCases.getChat(userId1, userId2);

      return res.status(StatusCode.OK).json({
        success: true,
        data: chat,
        message: "successfully retrieved chat",
      });
    } catch (error) {
      console.log("Error while getting chat", error);
      next(error);
    }
  }

  async getAllChats(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?._id) throw new CustomError("user not found", 400);

      const chats = await this.chatUseCases.getAllChats(req.user?._id);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "successfully retrieved all chats",
        data: chats,
      });
    } catch (error) {
      console.log("Error while getting all chats", error);
      next(error);
    }
  }
}
