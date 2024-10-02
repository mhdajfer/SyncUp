import { IProjectRepository } from "../Interfaces/IProjectRepository";
import Project from "../Frameworks/models/Project";
import { IProject } from "../Interfaces/IProject";
import { resourceLimits } from "worker_threads";
import { CustomError } from "../ErrorHandler/CustonError";

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

  async getAllProjects(): Promise<IProject[]> {
    try {
      const projectList = await Project.find();

      return projectList as unknown as IProject[];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getOneProject(projectId: string): Promise<IProject> {
    try {
      const project = await Project.findOne({ _id: projectId });

      if (!project) throw new CustomError("Project not found", 400);

      return project as unknown as IProject;
    } catch (error) {
      throw error;
    }
  }
}
