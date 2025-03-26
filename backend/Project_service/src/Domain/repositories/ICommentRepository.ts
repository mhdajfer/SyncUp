import { Task } from "./IProject";

export interface ICommentRepository {
  submitComment(
    message: string,
    taskId: string,
    authorId: string
  ): Promise<Task>;
}
