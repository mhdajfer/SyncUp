import { IProject } from "./IProject";

export interface IProjectRepository {
  createProject(input: IProject): Promise<IProject>;
  getAllProjects(): Promise<IProject[]>;
  getOneProject(ProjectId: string): Promise<IProject>;
}
