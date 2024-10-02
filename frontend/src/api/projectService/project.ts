import { userInstance } from "@/axios";
import { CreateProjectResponse } from "@/Components/Forms/ProjectForm";
import { Project } from "@/interfaces/Project";

// interface Response {
//   success: boolean;
//   data: Project[] | Project;
//   message: string;
// }

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

export const getOneProject = async (
  projectId: string
): Promise<{ success: boolean; message: string; data: Project }> => {
  try {
    const response = await userInstance.post("/projects/getProject", {projectId});

    return response.data as {
      success: boolean;
      message: string;
      data: Project;
    };
  } catch (error) {
    throw error;
  }
};
