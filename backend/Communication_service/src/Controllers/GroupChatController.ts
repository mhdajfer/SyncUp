import { NextFunction, Request, Response } from "express";
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

      console.log(groupName, users);

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

  async addNewMemberToGroupChat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { users, chatId }: { users: IUser[]; chatId: string } = req.body;

      if (users.length == 0 || !chatId)
        throw new CustomError("required params not provided", 409);

      const userIds: string[] = users
        .map((user) => user._id)
        .filter((id): id is string => id !== undefined);

      const updatedChat = await this.groupChatUseCases.addNewMember(
        userIds,
        chatId
      );

      return res.status(StatusCode.OK).json({
        success: true,
        message: "new member added successfully",
        data: updatedChat,
      });
    } catch (error) {
      console.log("Error while adding new member to group chat", error);
      next(error);
    }
  }
}
