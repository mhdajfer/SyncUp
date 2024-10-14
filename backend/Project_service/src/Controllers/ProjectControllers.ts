import { NextFunction, Request, Response } from "express";
import { IProject } from "../Interfaces/IProject";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";
import { validationResult } from "express-validator";
import { CustomRequest } from "../Interfaces/CustomRequest";
import { CustomError } from "../ErrorHandler/CustonError";

export class ProjectControllers {
  constructor(private projectUseCases: IProjectUseCases) {}

  async createProject(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      //req validation
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty())
        return res.json({ success: false, data: null, message: errors });
      console.log("formData", req.body);

      const projectDetails: IProject = req.body;
      const authUser = req.user;

      if (!authUser?._id) throw new CustomError("Manager not found", 409);

      const result = await this.projectUseCases.createProject({
        ...projectDetails,
        created_by: authUser._id,
      });

      if (!result) throw new Error(`Error in Project controller`);
      console.log("created..", result);

      return res
        .status(201)
        .json({ success: true, result, message: "project created" });
    } catch (error: any) {
      console.log(`Error while creating project ${error.message}`);
      console.log("error", error.message);

      return res
        .status(400)
        .json({ success: false, data: null, message: error.message });
    }
  }

  async getProjectList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const authUser = req.user;
      console.log("auth user ", authUser);

      if (!authUser?._id) throw new CustomError("Manager not found", 409);

      const result = await this.projectUseCases.getProjectList(authUser._id);

      console.log("result is :**********", result, authUser._id);

      if (!result) throw new Error(`Error in Project controller`);

      return res.status(201).json({ result });
    } catch (error: any) {
      console.log(`Error while retreiving project list ${error.message}`);
    }
  }

  async getAssignedProjects(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authUser = req.user;
      console.log("auth user ", authUser);

      if (!authUser?._id) throw new CustomError("Manager not found", 409);

      const result = await this.projectUseCases.getAssignedProjects(
        authUser._id
      );

      console.log("result is :**********", result, authUser._id);

      if (!result) throw new Error(`Error in Project controller`);

      return res.status(201).json({ result });
    } catch (error: any) {
      console.log(`Error while retreiving project list ${error.message}`);
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.body;

      const project = await this.projectUseCases.getOneProject(projectId);
      console.log(project);
      return res.status(200).json({
        success: true,
        message: "retreived project details",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async editProject(req: Request, res: Response, next: NextFunction) {
    try {
      const data: IProject = req.body;

      console.log("got the req to edit project", data);

      const response = await this.projectUseCases.editProject(data);

      return res.status(200).json({
        success: true,
        message: "project modified successfully",
        data: response,
      });
    } catch (error) {
      throw error;
    }
  }
<<<<<<< Updated upstream
=======

  async addTasks(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { tasks, projectId } = req.body;

      const tasksWithProjectId = tasks.map((task: any) => ({
        ...task,
        status: task.status || undefined,
        priority: task.priority || undefined,
        projectId,
      }));

      console.log(req.body);

      if (!tasks || !projectId)
        return res.status(400).json({
          success: false,
          message: "task details not found",
          data: null,
        });

      const project = await this.projectUseCases.addTasks(tasksWithProjectId);

      return res.status(200).json({
        success: true,
        message: "task details added successfully",
        data: project,
      });
    } catch (error) {
      throw error;
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.body;

      console.log(projectId);

      const tasks = await this.projectUseCases.getTasks(projectId);

      return res.status(200).json({
        success: true,
        data: tasks,
        message: "Tasks successfully retrieved",
      });
    } catch (error) {
      throw error;
    }
  }

  async getOneTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.body;
      console.log("got the req inside getTask", taskId);

      const taskDetails = await this.projectUseCases.getOneTask(taskId);

      console.log(taskDetails);

      return res.status(200).json({
        success: true,
        message: "task details successfully retrieved",
        data: taskDetails,
      });
    } catch (error) {
      throw error;
    }
  }

  async editTask(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      console.log("got req in editTask", data);

      const updatedTask = await this.projectUseCases.editTask(data);

      console.log(updatedTask);

      return res.status(200).json({
        success: true,
        data: updatedTask,
        message: "Task updated successfully",
      });
    } catch (error) {
      throw error;
    }
  }
>>>>>>> Stashed changes
}
