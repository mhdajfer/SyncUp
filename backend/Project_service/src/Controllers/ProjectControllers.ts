import { NextFunction, Request, Response } from "express";
import { IProject } from "../Interfaces/IProject";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";
import { validationResult } from "express-validator";

export class ProjectControllers {
  constructor(private projectUseCases: IProjectUseCases) {}

  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      //req validation
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty())
        return res.json({ success: false, data: null, message: errors });
      console.log("formData", req.body);

      const projectDetails: IProject = req.body;

      const result = await this.projectUseCases.createProject(projectDetails);

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

  async getProjectList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.projectUseCases.getProjectList();

      if (!result) throw new Error(`Error in Project controller`);

      return res.status(201).json({ result });
    } catch (error: any) {
      console.log(`Error while creating project ${error.message}`);
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
}
