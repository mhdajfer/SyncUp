import express from "express";
import { ProjectRepository } from "../Repositories/ProjectRepository";
import { ProjectUseCases } from "../Use-cases/ProjectUseCases";
import { ProjectControllers } from "../Controllers/ProjectControllers";

const router = express.Router();

const projectRepository = new ProjectRepository();
const projectUseCases = new ProjectUseCases(projectRepository);
const projectController = new ProjectControllers(projectUseCases);

router.post("/", projectController.createProject.bind(projectController));
router.get("/", projectController.getProjectList.bind(projectController));

export default router;
