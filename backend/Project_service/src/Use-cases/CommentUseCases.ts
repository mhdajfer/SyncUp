import { CustomError } from "../ErrorHandler/CustonError";
import { ICommentRepository } from "../Interfaces/ICommentRepository";
import { ICommentUseCase } from "../Interfaces/ICommentUseCase";
import { Task } from "../Interfaces/IProject";
import { CommentRepository } from "../Repositories/CommentRepository";

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

      if (!task) throw new CustomError("Comment not submitted", 409);

      return task;
    } catch (error) {
      throw error;
    }
  }
}
