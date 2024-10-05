import { IProject } from "./IProject";

export interface IProjectUseCases {
  getProjectList(managerId: string): Promise<IProject[]>;
  createProject(input: IProject): Promise<IProject>;
  editProject(input: IProject): Promise<IProject>;
  getOneProject(projectId: string): Promise<IProject>;
}
