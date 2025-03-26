import { NextFunction, Request, Response } from "express";
import { IProject, Task } from "../../Shared/Interfaces/IProject";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";
import { validationResult } from "express-validator";
import { CustomRequest } from "../../Shared/Interfaces/CustomRequest";
import { CustomError } from "../../ErrorHandler/CustonError";
import { StatusCode } from "../../Shared/Interfaces/StatusCode";
import { KafkaConnection } from "../../Config/kafka/kafkaConnection";
import { UserProducer } from "../../Infrastructure/kafka/Producers/UserProducer";

export class ProjectControllers {
  constructor(private _projectUseCases: IProjectUseCases) {}

  async createProject(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //req validation
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty())
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, data: null, message: errors });
      console.log("formData", req.body);

      const projectDetails: IProject = req.body;
      const authUser = req.user;

      if (!authUser?._id)
        throw new CustomError("Manager not found", StatusCode.CONFLICT);

      const result = await this._projectUseCases.createProject({
        ...projectDetails,
        created_by: authUser._id,
      });

      if (!result) throw new Error(`Error in Project controller`);
      console.log("created..", result);

      res
        .status(StatusCode.CREATED)
        .json({ success: true, result, message: "project created" });
    } catch (error) {
      console.log(`Error while creating project ${error}`);

      next(error);
    }
  }

  async getProjectList(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authUser = req.user;
      console.log("auth user ", authUser);

      if (!authUser?._id)
        throw new CustomError("Manager not found", StatusCode.CONFLICT);

      const result = await this._projectUseCases.getProjectList(authUser._id);

      console.log("result is :**********", result, authUser._id);

      if (!result) throw new Error(`Error in Project controller`);

      res.status(StatusCode.CREATED).json({ result });
    } catch (error) {
      console.log(`Error while retreiving project list ${error}`);
      next(error);
    }
  }

  async getAssignedProjects(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authUser = req.user;
      console.log("auth user ", authUser);

      if (!authUser?._id)
        throw new CustomError("Manager not found", StatusCode.CONFLICT);

      const result = await this._projectUseCases.getAssignedProjects(
        authUser._id
      );

      console.log("result is :**********", result, authUser._id);

      if (!result) throw new Error(`Error in Project controller`);

      res.status(StatusCode.CREATED).json({ result });
    } catch (error) {
      console.log(`Error while retreiving project list ${error}`);
      next(error);
    }
  }

  async getAssignedProjectsForDev(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authUser = req.user;
      console.log("auth user ", authUser);

      if (!authUser?._id)
        throw new CustomError("Manager not found", StatusCode.CONFLICT);

      const result = await this._projectUseCases.getAssignedProjectsForDev(
        authUser._id
      );

      console.log("result is :**********", result, authUser._id);

      if (!result) throw new Error(`Error in Project controller`);

      res.status(StatusCode.CREATED).json({ result });
    } catch (error) {
      console.log(`Error while retreiving project list ${error}`);
      next(error);
    }
  }

  async getProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { projectId } = req.body;

      const project = await this._projectUseCases.getOneProject(projectId);
      console.log(project);
      res.status(StatusCode.OK).json({
        success: true,
        message: "retreived project details",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async editProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: IProject = req.body;

      console.log("got the req to edit project", data);

      const response = await this._projectUseCases.editProject(data);

      res.status(StatusCode.OK).json({
        success: true,
        message: "project modified successfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async addTasks(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { tasks, projectId } = req.body;

      const tasksWithProjectId: Task[] = tasks.map((task: Task) => ({
        ...task,
        status: task.status || undefined,
        priority: task.priority || undefined,
        projectId,
      }));

      if (!tasks || !projectId)
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "task details not found",
          data: null,
        });

      const project = await this._projectUseCases.addTasks(tasksWithProjectId);

      const kafkaConnection = new KafkaConnection();
      const producer = await kafkaConnection.getProducerInstance();
      const userProducer = new UserProducer(producer);

      userProducer.sendDefaultMessage(
        "task-added",
        "user-events",
        JSON.stringify(project)
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "task details added successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { projectId } = req.body;

      console.log(projectId);

      const tasks = await this._projectUseCases.getTasks(projectId);

      res.status(StatusCode.OK).json({
        success: true,
        data: tasks,
        message: "Tasks successfully retrieved",
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { taskId } = req.body;
      console.log("got the req inside getTask", taskId);

      const taskDetails = await this._projectUseCases.getOneTask(taskId);

      console.log(taskDetails);

      res.status(StatusCode.OK).json({
        success: true,
        message: "task details successfully retrieved",
        data: taskDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  async editTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      console.log("got req in editTask", data);

      const updatedTask = await this._projectUseCases.editTask(data);

      console.log(updatedTask);

      res.status(StatusCode.OK).json({
        success: true,
        data: updatedTask,
        message: "Task updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getDevTasks(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      if (!user?._id)
        throw new CustomError("user not found", StatusCode.UNAUTHORIZED);

      const tasks = await this._projectUseCases.getDevTasks(user._id);

      res.status(StatusCode.OK).json({
        success: true,
        message: " tasks returned successfully",
        data: tasks,
      });
    } catch (error) {
      console.log("error while retrieving tasks for the developer");
      next(error);
    }
  }

  async AddTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, projectId } = req.body;

      const project = await this._projectUseCases.addTeamMember(
        userId,
        projectId
      );

      console.log("member added ...", project);

      res.status(StatusCode.OK).json({
        success: true,
        message: "new team member added",
        data: project,
      });
    } catch (error) {
      console.log("error while adding a new member to the team");
      next(error);
    }
  }

  async removeTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, projectId } = req.body;

      const project = await this._projectUseCases.removeTeamMember(
        userId,
        projectId
      );

      console.log("member removed ...", project);

      res.status(StatusCode.OK).json({
        success: true,
        message: "team member removed",
        data: project,
      });
    } catch (error) {
      console.log("error while removing member");
      next(error);
    }
  }
}
