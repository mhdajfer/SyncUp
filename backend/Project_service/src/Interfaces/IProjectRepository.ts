import { IProject } from "./IProject";

export interface IProjectRepository {
  createProject(input: IProject): Promise<IProject>;
  getAllProjects(): Promise<IProject[]>;
}
