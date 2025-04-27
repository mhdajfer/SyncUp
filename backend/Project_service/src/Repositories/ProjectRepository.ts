import { IProjectRepository, StatusCode } from "../Interfaces";
import { Project } from "../Frameworks/models";
import { IProject, Task } from "../Interfaces";
import { User } from "../Frameworks/models";
import { CustomError } from "../ErrorHandler/CustonError";
import { IUser } from "../Interfaces";
import { taskModel } from "../Frameworks/models";
import { ObjectId } from "mongodb";

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

  async getAssignedProjectsForDev(devId: string): Promise<IProject[]> {
    try {
      console.log("userid", devId);
      const projectList = await Project.find({
        developers: { $in: [new ObjectId(devId)] },
      });

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

      if (!project) throw new CustomError("Project not found", StatusCode.BAD_REQUEST);

      return project as unknown as IProject;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: IUser): Promise<IUser> {
    try {
      console.log("inside repository", user.tenant_id);
      delete user._id;

      const response = await User.updateMany(
        { email: user.email },
        { ...user }
      );

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
        throw new CustomError("user not created in tenant service", StatusCode.CONFLICT);

      return newUser.toObject() as IUser;
    } catch (error) {
      console.log("Error in Consumer Repository: " + error);
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
        throw new CustomError("project not modified", StatusCode.BAD_REQUEST);
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
        .populate("assignee")
        .populate("comments.author");

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
      const tasks = await taskModel
        .find({ assignee: assignee })
        .populate("assignee")
        .exec();

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

  async removeTeamMember(userId: string, projectId: string): Promise<IProject> {
    try {
      const response = await Project.findOneAndUpdate(
        { _id: projectId },
        { $pull: { developers: userId } },
        { new: true }
      )
        .populate("developers")
        .populate("managerId");

      return response as unknown as IProject;
    } catch (error) {
      throw error;
    }
  }
}
