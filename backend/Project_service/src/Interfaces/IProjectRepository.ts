import { IProject } from "./IProject";

export interface IProjectRepository {
  createProject(input: IProject): Promise<IProject>;
  getAllProjects(managerId: string): Promise<IProject[]>;
  getOneProject(ProjectId: string): Promise<IProject>;
}
