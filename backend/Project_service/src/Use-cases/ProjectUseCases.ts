import { CustomError } from "../ErrorHandler/CustonError";
import { IProject, Task } from "../Interfaces/IProject";
import { IProjectRepository } from "../Interfaces/IProjectRepository";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";
import { IUser } from "../Interfaces/IUser";

export class ProjectUseCases implements IProjectUseCases {
  constructor(private projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository;
  }
  async getProjectList(managerId: string): Promise<IProject[]> {
    try {
      const data = await this.projectRepository.getAllProjects(managerId);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedProjects(managerId: string): Promise<IProject[]> {
    try {
      const data = await this.projectRepository.getAssignedProjects(managerId);

      return data;
    } catch (error) {
      throw error;
    }
  }
  async createProject(input: IProject): Promise<IProject> {
    try {
      const data = await this.projectRepository.createProject(input);

      if (!data) throw new Error(`Project not found`);

      return data;
    } catch (error) {
      throw error;
    }
  }
  async getOneProject(projectId: string): Promise<IProject> {
    try {
      const project = await this.projectRepository.getOneProject(projectId);

      return project;
      return project;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: IUser) {
    try {
      return await this.projectRepository.updateUser(user);
    } catch (error: any) {
      throw error;
    }
  }

  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = await this.projectRepository.createUser(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async editProject(data: IProject): Promise<IProject> {
    try {
      const projectData = await this.projectRepository.editProject(data);

      return projectData;
    } catch (error) {
      throw error;
    }
  }

  async addTasks(data: Task[]): Promise<Task> {
    try {
      const project = await this.projectRepository.addTasks(data);

      if (!project) throw new CustomError("project not found", 409);

      return project;
    } catch (error) {
      throw error;
    }
  }

  async getTasks(projectId: string): Promise<Task[]> {
    try {
      const tasks = await this.projectRepository.getTasks(projectId);

      if (!tasks) throw new CustomError("tasks not found", 409);

      return tasks;
    } catch (error) {
      throw error;
    }
  }
}
