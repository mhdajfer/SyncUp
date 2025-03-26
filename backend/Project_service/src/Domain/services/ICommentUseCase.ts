import { Task } from "./IProject";

export interface ICommentUseCase {
  submitComment(
    message: string,
    taskId: string,
    authorId: string
  ): Promise<Task>;
}
