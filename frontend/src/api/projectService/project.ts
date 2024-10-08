import { userInstance } from "@/axios";
import { CreateProjectResponse } from "@/Components/Forms/ProjectForm";
import { Project } from "@/interfaces/Project";

export const getProjects = async (
  isForPManager = false
): Promise<{ result: Project[] }> => {
  try {
    const response = await userInstance.get(
      isForPManager ? "/projects/forPM" : "/projects"
    );

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
    const response = await userInstance.post("/projects/getProject", {
      projectId,
    });

    return response.data as {
      success: boolean;
      message: string;
      data: Project;
    };
  } catch (error) {
    throw error;
  }
};

export const editProject = async (data: Project) => {
  try {
    const response = await userInstance.put("/projects", data);

    return response.data as {
      success: boolean;
      message: string;
      data: Project;
    };
  } catch (error) {
    throw error;
  }
};
