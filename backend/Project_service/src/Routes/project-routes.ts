import express from "express";
import { ProjectRepository } from "../Repositories/ProjectRepository";
import { ProjectUseCases } from "../Use-cases/ProjectUseCases";
import { ProjectControllers } from "../Controllers/ProjectControllers";
import { checkSchema } from "express-validator";
import projectValidator from "../validators/projectValidator";
import userAuth from "../Middlewares/userAuth";

const router = express.Router();

const projectRepository = new ProjectRepository();
const projectUseCases = new ProjectUseCases(projectRepository);
const projectController = new ProjectControllers(projectUseCases);

router.post(
  "/",
  userAuth,
  checkSchema(projectValidator()),
  projectController.createProject.bind(projectController)
);

router.post(
  "/getProject",

  projectController.getProject.bind(projectController)
);
router.get(
  "/",
  userAuth,
  projectController.getProjectList.bind(projectController)
);

router.put(
  "/",
  userAuth,
  projectController.editProject.bind(projectController)
);

export default router;
