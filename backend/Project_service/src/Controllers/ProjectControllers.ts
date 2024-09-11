import { NextFunction, Request, Response } from "express";
import { IProject } from "../Interfaces/IProject";
import { IProjectUseCases } from "../Interfaces/IProjectUseCases";

export class ProjectControllers {
  constructor(private projectUseCases: IProjectUseCases) {}

  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectDetails: IProject = req.body;

      const result = await this.projectUseCases.createProject(projectDetails);

      if (!result) throw new Error(`Error in Project controller`);

      return res.status(201).json({ result });
    } catch (error: any) {
      console.log(`Error while creating project ${error.message}`);
    }
  }
}
