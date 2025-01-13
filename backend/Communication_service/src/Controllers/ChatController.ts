import { NextFunction, Request, response, Response } from "express";
import { CustomRequest } from "../interfaces/CustomRequest";
import { CustomError } from "../ErrorHandler/CustonError";
import { ICall, IChatUseCases } from "../interfaces";
import { StatusCode } from "../interfaces/StatusCode";

export class ChatController {
  constructor(private _chatUseCases: IChatUseCases) {}

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this._chatUseCases.getAllUsers();

      res.status(StatusCode.OK).json({
        success: true,
        message: "successfully retrieved all users",
        data: users,
      });
    } catch (error) {
      console.log("Error while getting users", error);
      next(error);
    }
  }

  async getOneChat(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId1 = req.user?._id;
      const userId2 = req.body.userId;
      console.log("logging user1 and user2", userId1, userId2);

      if (!userId1 || !userId2)
        throw new CustomError("any of the user not found", StatusCode.CONFLICT);

      const chat = await this._chatUseCases.getChat(userId1, userId2);

      res.status(StatusCode.OK).json({
        success: true,
        data: chat,
        message: "successfully retrieved chat",
      });
    } catch (error) {
      console.log("Error while getting chat", error);
      next(error);
    }
  }

  async getAllChats(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?._id)
        throw new CustomError("user not found", StatusCode.BAD_REQUEST);

      const chats = await this._chatUseCases.getAllChats(req.user?._id);

      res.status(StatusCode.OK).json({
        success: true,
        message: "successfully retrieved all chats",
        data: chats,
      });
    } catch (error) {
      console.log("Error while getting all chats", error);
      next(error);
    }
  }

  async sendMessage(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const senderId = req.user?._id;
      const { content, chatId, file } = req.body;

      if (!senderId)
        throw new CustomError("User not found", StatusCode.CONFLICT);

      const message = await this._chatUseCases.sendMessage(
        senderId,
        content,
        chatId,
        file
      );

      res
        .status(StatusCode.CREATED)
        .json({ success: true, data: message, message: "message sent." });
    } catch (error) {
      console.log("error while sending message", error);
      next(error);
    }
  }

  async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { chatId } = req.body;
      const messages = await this._chatUseCases.getMessages(chatId);

      res
        .status(StatusCode.OK)
        .json({ success: true, message: "retrieved messages", data: messages });
    } catch (error) {
      console.log("error while getting messages", error);
      next(error);
    }
  }

  async createCallRecord(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: ICall = req.body;
      const userId = req.user?._id;

      if (!userId) throw new CustomError("User not found", StatusCode.CONFLICT);

      const callRecord = await this._chatUseCases.createCallRecord(
        data,
        userId
      );

      res.status(StatusCode.CREATED).json({
        success: true,
        message: "call record created successfully",
        data: callRecord,
      });
    } catch (error) {
      console.log("error while creating call record", error);
      next(error);
    }
  }

  async getCallRecords(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) throw new CustomError("User not found", StatusCode.CONFLICT);

      const callRecords = await this._chatUseCases.getCallHistory(userId);

      console.log(callRecords);

      res.status(StatusCode.OK).json({
        success: true,
        message: "call records retrieved successfully",
        data: callRecords,
      });
    } catch (error) {
      console.log("error while getting call records", error);
      next(error);
    }
  }

  async updateCallRecord(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new CustomError("User not found", StatusCode.CONFLICT);
      }

      const updatedCallRecord = await this._chatUseCases.updateCallRecord(
        userId
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "call record updated successfully",
        data: updatedCallRecord,
      });
    } catch (error) {
      console.log("error while updating call record", error);
      next(error);
    }
  }
}
