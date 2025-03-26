import { CustomError } from "../../ErrorHandler/CustonError";
import { ICommentRepository, StatusCode } from "../../Shared/Interfaces";
import { ICommentUseCase } from "../../Shared/Interfaces";
import { Task } from "../../Shared/Interfaces";

export class CommentUseCases implements ICommentUseCase {
  constructor(private _commentRepository: ICommentRepository) {
    this._commentRepository = _commentRepository;
  }
  async submitComment(
    message: string,
    taskId: string,
    authorId: string
  ): Promise<Task> {
    try {
      console.log(message, taskId, authorId);
      const task = await this._commentRepository.submitComment(
        message,
        taskId,
        authorId
      );

      if (!task)
        throw new CustomError("Comment not submitted", StatusCode.CONFLICT);

      return task;
    } catch (error) {
      throw error;
    }
  }
}
