import { userInstance } from "@/axios";
import { CreateProjectResponse } from "@/Components/Forms/ProjectForm";
import { Project } from "@/interfaces/Project";

export const getProjects = async (): Promise<{ result: Project[] }> => {
  try {
    const response = await userInstance.get("/projects");

    return response.data as unknown as { result: Project[] };
  } catch (error) {
    throw error;
  }
};

export const createProject = async (
  formData: Project
): Promise<CreateProjectResponse> => {
  try {
    const response: { data: CreateProjectResponse } = await userInstance.post(
      "/projects",
      formData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
