import { userInstance } from "@/axios";
import { Task } from "@/interfaces/Project";

interface Response{
    message: string;
    success: boolean;
    data: Task;
}

export const submitComment = async (message: string, taskId: string) => {
  try {
    const response = await userInstance.post("/projects/comment/add", {
      message,
      taskId,
    });

    return response.data as Response;
  } catch (error) {
    throw error;
  }
};
