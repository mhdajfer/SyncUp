import { userInstance } from "@/axios";
import { Project } from "@/interfaces/Project";

export const getProjects = async (): Promise<{ result: Project[] }> => {
  try {
    const response = await userInstance.get("/projects");

    return response.data as unknown as { result: Project[] };
  } catch (error) {
    throw error;
  }
};
