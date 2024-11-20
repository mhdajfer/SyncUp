import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/CustomRequest";
import { IGroupChatUseCases } from "../interfaces/IGroupChatUseCases";
import { CustomError } from "../ErrorHandler/CustonError";
import { IUser } from "../interfaces/IUser";
import { StatusCode } from "../Interfaces/StatusCode";

export class GroupChatController {
  constructor(private groupChatUseCases: IGroupChatUseCases) {}
  async createGroupChat(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { groupName, users } = req.body;
      const currentUser = req.user;

      console.log(groupName, users)

      if (!req.user) throw new CustomError("user not found", 400);

      const newChat = await this.groupChatUseCases.createGroupChat(
        groupName as string,
        users as IUser[],
        currentUser as IUser
      );

      return res
        .status(StatusCode.CREATED)
        .json({ success: true, message: "Group chat created", data: newChat });
    } catch (error) {
      console.log("Error creating group chat", error);
      next(error);
    }
  }
}
