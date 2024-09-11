import { IProject } from "./IProject";

export interface IProjectUseCases {
  getProjectList(): Promise<IProject[]>;
  createProject(input: IProject): Promise<IProject>;
  editProject(input: IProject): Promise<IProject>;
  getOneProject(projectId: string): Promise<IProject>;
}
