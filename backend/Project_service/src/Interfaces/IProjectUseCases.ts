import { IProject } from "./IProject";
import { IUser } from "./IUser";

export interface IProjectUseCases {
  getProjectList(managerId: string): Promise<IProject[]>;
  createProject(input: IProject): Promise<IProject>;
  getOneProject(projectId: string): Promise<IProject>;
  updateUser(user: IUser): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
}
