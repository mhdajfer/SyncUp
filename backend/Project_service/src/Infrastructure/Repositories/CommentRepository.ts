import { taskModel } from "../../Domain/models";
import { ICommentRepository } from "../../Shared/Interfaces";
import { Task } from "../../Shared/Interfaces";

export class CommentRepository implements ICommentRepository {
  async submitComment(
    message: string,
    taskId: string,
    authorId: string
  ): Promise<Task> {
    try {
      const task = await taskModel
        .findOneAndUpdate(
          { _id: taskId },
          { $push: { comments: { content: message, author: authorId } } }
        )
        .populate("comments.author");

      console.log(task);

      return task as unknown as Task;
    } catch (error) {
      throw error;
    }
  }
}
