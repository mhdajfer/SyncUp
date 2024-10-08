import { IProject } from "./IProject";
import { IUser } from "./IUser";

export interface IProjectRepository {
  createProject(input: IProject): Promise<IProject>;
  getAllProjects(managerId: string): Promise<IProject[]>;
  getOneProject(ProjectId: string): Promise<IProject>;
  updateUser(user: IUser): Promise<IUser>;
  createUser(user: IUser): Promise<IUser>;
  editProject(data: IProject): Promise<IProject>;
}
