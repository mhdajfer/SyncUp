import { NextFunction, Request, Response } from "express";
import { ICommentUseCase } from "../Interfaces/ICommentUseCase";
import { CustomRequest } from "../Interfaces/CustomRequest";
import { CustomError } from "../ErrorHandler/CustonError";
import { StatusCode } from "../Interfaces/StatusCode";

export class CommentController {
  constructor(private commentUseCases: ICommentUseCase) {}

  async addComment(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { message, taskId } = req.body;
      const user = req.user;
      console.log("adding comment");

      if (!user?._id) throw new CustomError("author not found", 409);

      const taskResponse = await this.commentUseCases.submitComment(
        message,
        taskId,
        user?._id
      );

      return res
        .status(StatusCode.OK)
        .json({ success: true, message: "Comment added", data: taskResponse });
    } catch (error) {
      console.log("error while adding comment", error);
      next(error);
    }
  }
}
