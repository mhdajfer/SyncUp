import { CustomError } from "../ErrorHandler/CustonError";
import { IProject, Task } from "../Interfaces/IProject";
import { IProjectRepository } from "../Interfaces/IProjectRepository";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";
import { IUser } from "../Interfaces/IUser";

export class ProjectUseCases implements IProjectUseCases {
  constructor(private _projectRepository: IProjectRepository) {
    this._projectRepository = _projectRepository;
  }
  async getProjectList(managerId: string): Promise<IProject[]> {
    try {
      const data = await this._projectRepository.getAllProjects(managerId);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedProjects(managerId: string): Promise<IProject[]> {
    try {
      const data = await this._projectRepository.getAssignedProjects(managerId);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAssignedProjectsForDev(devId: string): Promise<IProject[]> {
    try {
      const data = await this._projectRepository.getAssignedProjectsForDev(
        devId
      );

      return data;
    } catch (error) {
      throw error;
    }
  }
  async createProject(input: IProject): Promise<IProject> {
    try {
      const data = await this._projectRepository.createProject(input);

      if (!data) throw new Error(`Project not found`);

      return data;
    } catch (error) {
      throw error;
    }
  }
  async getOneProject(projectId: string): Promise<IProject> {
    try {
      const project = await this._projectRepository.getOneProject(projectId);

      return project;
      return project;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: IUser) {
    try {
      return await this._projectRepository.updateUser(user);
    } catch (error) {
      throw error;
    }
  }

  async createUser(data: IUser): Promise<IUser> {
    try {
      const user = await this._projectRepository.createUser(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async editProject(data: IProject): Promise<IProject> {
    try {
      const projectData = await this._projectRepository.editProject(data);

      return projectData;
    } catch (error) {
      throw error;
    }
  }

  async addTasks(data: Task[]): Promise<Task> {
    try {
      const project = await this._projectRepository.addTasks(data);

      if (!project) throw new CustomError("project not found", 409);

      return project;
    } catch (error) {
      throw error;
    }
  }

  async getTasks(projectId: string): Promise<Task[]> {
    try {
      const tasks = await this._projectRepository.getTasks(projectId);

      if (!tasks) throw new CustomError("tasks not found", 409);

      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async getOneTask(taskId: string): Promise<Task> {
    try {
      const taskDetails = await this._projectRepository.getOneTask(taskId);

      if (!taskDetails) throw new CustomError("taskDetails not found", 409);

      return taskDetails;
    } catch (error) {
      throw error;
    }
  }

  async editTask(data: Task): Promise<Task> {
    try {
      const updatedTask = await this._projectRepository.editTask(data);

      if (!updatedTask) throw new CustomError("Task not found", 409);

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async getDevTasks(assignee: string): Promise<Task[]> {
    try {
      const tasks = await this._projectRepository.getDevTasks(assignee);

      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async addTeamMember(userId: string, projectId: string): Promise<IProject> {
    try {
      const project = await this._projectRepository.addTeamMember(
        userId,
        projectId
      );

      if (!project) throw new CustomError("Member already exists", 409);

      return project;
    } catch (error) {
      throw error;
    }
  }

  async removeTeamMember(userId: string, projectId: string): Promise<IProject> {
    try {
      const project = await this._projectRepository.removeTeamMember(
        userId,
        projectId
      );

      if (!project) {
        throw new CustomError(
          "Project not found or developer not part of the team",
          409
        );
      }
      return project;
    } catch (error) {
      throw error;
    }
  }
}
