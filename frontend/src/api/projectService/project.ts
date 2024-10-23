import { userInstance } from "@/axios";
import { CreateProjectResponse } from "@/Components/Forms/ProjectForm";
import { Project, Task } from "@/interfaces/Project";

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

export const addTasks = async (tasks: Task[], projectId: string) => {
  try {
    const response = await userInstance.post("/projects/tasks/new", {
      tasks,
      projectId,
    });

    return response.data as { success: boolean; message: string; data: Task[] };
  } catch (error) {
    throw error;
  }
};

export const getProjectTasks = async (projectId: string) => {
  try {
    console.log("sending req for tasks", projectId);

    const response = await userInstance.post("/projects/tasks", { projectId });

    return response.data as { success: boolean; message: string; data: Task[] };
  } catch (error) {
    throw error;
  }
};

export const getTask = async (taskId: string) => {
  try {
    const response = await userInstance.post("/projects/tasks/one", { taskId });

    return response.data as { success: boolean; message: string; data: Task };
  } catch (error) {
    throw error;
  }
};

export const editTask = async (data: Task) => {
  try {
    const response = await userInstance.put("/projects/tasks/edit", data);

    return response.data as { success: boolean; message: string; data: Task };
  } catch (error) {
    throw error;
  }
};

export const getDevTasks = async () => {
  try {
    const response = await userInstance.get("/projects/tasks/dev");

    return response.data as { message: string; data: Task[]; success: boolean };
  } catch (error) {
    throw error;
  }
};
