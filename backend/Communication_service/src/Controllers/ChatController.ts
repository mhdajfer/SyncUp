import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../interfaces/CustomRequest";
import { CustomError } from "../ErrorHandler/CustonError";
import { IChatUseCases } from "../interfaces/IChatUseCases";
import { StatusCode } from "../Interfaces/StatusCode";
import { IMessage } from "../interfaces/IMessage";

export class ChatController {
  constructor(private _chatUseCases: IChatUseCases) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this._chatUseCases.getAllUsers();

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
      console.log("logging user1 and user2", userId1, userId2);

      if (!userId1 || !userId2)
        throw new CustomError("any of the user not found", 409);

      const chat = await this._chatUseCases.getChat(userId1, userId2);

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

      const chats = await this._chatUseCases.getAllChats(req.user?._id);

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

  async sendMessage(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const senderId = req.user?._id;
      const { content, chatId, file } = req.body;

      if (!senderId) throw new CustomError("User not found", 409);

      const message = await this._chatUseCases.sendMessage(
        senderId,
        content,
        chatId,
        file
      );

      return res
        .status(StatusCode.CREATED)
        .json({ success: true, data: message, message: "message sent." });
    } catch (error) {
      console.log("error while sending message", error);
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.body;
      const messages = await this._chatUseCases.getMessages(chatId);

      return res
        .status(StatusCode.OK)
        .json({ success: true, message: "retrieved messages", data: messages });
    } catch (error) {
      console.log("error while getting messages", error);
      next(error);
    }
  }
}
