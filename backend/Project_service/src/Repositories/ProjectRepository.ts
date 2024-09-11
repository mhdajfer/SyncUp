import { IProjectRepository } from "../Interfaces/IProjectRepository";
import Project from "../Frameworks/models/Project";
import { IProject } from "../Interfaces/IProject";

export class ProjectRepository implements IProjectRepository {
  async createProject(input: IProject): Promise<IProject> {
    try {
      const newProject = new Project(input);
      await newProject.save();

      const result = newProject.toObject() as unknown;
      return result as IProject;
    } catch (error) {
      throw error;
    }
  }
}