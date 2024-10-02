import { IProject } from "../Interfaces/IProject";
import { IProjectRepository } from "../Interfaces/IProjectRepository";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";

export class ProjectUseCases implements IProjectUseCases {
  constructor(private projectRepository: IProjectRepository) {
    this.projectRepository = projectRepository;
  }
  async getProjectList(): Promise<IProject[]> {
    try {
      const data = await this.projectRepository.getAllProjects();

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
  editProject(input: IProject): Promise<IProject> {
    throw new Error("Method not implemented.");
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
}
