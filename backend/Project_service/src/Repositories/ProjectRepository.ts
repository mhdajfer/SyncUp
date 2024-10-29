import { IProjectRepository } from "../Interfaces/IProjectRepository";
import Project from "../Frameworks/models/Project";
import { IProject, Task } from "../Interfaces/IProject";
import User from "../Frameworks/models/userModel";
import { CustomError } from "../ErrorHandler/CustonError";
import { IUser } from "../Interfaces/IUser";
import taskModel from "../Frameworks/models/Task";

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

  async getAllProjects(managerId: string): Promise<IProject[]> {
    try {
      const projectList = await Project.find({ created_by: managerId });

      return projectList as unknown as IProject[];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getAssignedProjects(managerId: string): Promise<IProject[]> {
    try {
      const projectList = await Project.find({ managerId: managerId });

      return projectList as unknown as IProject[];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  async getOneProject(projectId: string): Promise<IProject> {
    try {
      const project = await Project.findOne({ _id: projectId })
        .populate("managerId")
        .populate("developers")
        .exec();

      if (!project) throw new CustomError("Project not found", 400);

      return project as unknown as IProject;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: IUser): Promise<IUser> {
    try {
      console.log("inside repository", user.tenant_id);

      const response = await User.updateOne({ email: user.email }, { ...user });

      return response as unknown as IUser;
    } catch (error) {
      console.log("reached repository");

      throw error;
    }
  }

  async createUser(data: IUser): Promise<IUser> {
    try {
      const newData = new User(data);

      const newUser = await newData.save();

      if (!newUser)
        throw new CustomError("user not created in tenant service", 409);

      return newUser.toObject() as IUser;
    } catch (error: any) {
      console.log("Error in Consumer Repository: " + error.message);
      throw error;
    }
  }

  async editProject(data: IProject): Promise<IProject> {
    try {
      const editedData = await Project.findOneAndUpdate(
        { _id: data._id },
        { ...data },
        { new: true }
      );

      if (!editedData) {
        throw new CustomError("project not modified", 400);
      }

      return editedData as unknown as IProject;
    } catch (error) {
      throw error;
    }
  }

  async addTasks(data: Task[]): Promise<Task> {
    try {
      // const taskData = new taskModel(...data);
      const taskData = await taskModel.insertMany(data);
      console.log("task data", taskData);

      // taskData.save();

      return taskData as unknown as Task;
    } catch (error) {
      throw error;
    }
  }

  async getTasks(projectId: string): Promise<Task[]> {
    try {
      const tasks = await taskModel
        .find({ projectId: projectId })
        .populate("assignee");

      console.log("before sending the tasks to the user****", tasks);

      return tasks as unknown as Task[];
    } catch (error) {
      throw error;
    }
  }

  async getOneTask(taskId: string): Promise<Task> {
    try {
      const taskDetails = await taskModel
        .findOne({ _id: taskId })
        .populate("assignee");

      return taskDetails as unknown as Task;
    } catch (error) {
      throw error;
    }
  }

  async editTask(data: Task): Promise<Task> {
    try {
      const updatedTask = await taskModel.findOneAndUpdate(
        { _id: data._id },
        { ...data },
        { new: true }
      );

      return updatedTask as unknown as Task;
    } catch (error) {
      throw error;
    }
  }

  async getDevTasks(assignee: string): Promise<Task[]> {
    try {
      const tasks = await taskModel.find({ assignee: assignee });

      return tasks as unknown as Task[];
    } catch (error) {
      throw error;
    }
  }

  async addTeamMember(userId: string, projectId: string): Promise<IProject> {
    try {
      const response = await Project.findOneAndUpdate(
        { _id: projectId, developers: { $ne: userId } },
        { $push: { developers: { _id: userId } } },
        { new: true }
      )
        .populate("managerId")
        .populate("developers")
        .exec();

      return response as unknown as IProject;
    } catch (error) {
      throw error;
    }
  }
}
