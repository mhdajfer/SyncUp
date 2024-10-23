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

router.get(
  "/forPM",
  userAuth,
  projectController.getAssignedProjects.bind(projectController)
);

router.post(
  "/tasks/new",
  userAuth,
  projectController.addTasks.bind(projectController)
);

router.put(
  "/",
  userAuth,
  projectController.editProject.bind(projectController)
);

router.post(
  "/tasks",
  userAuth,
  projectController.getTasks.bind(projectController)
);

router.post(
  "/tasks/one",
  userAuth,
  projectController.getOneTask.bind(projectController)
);

router.put("/tasks/edit", projectController.editTask.bind(projectController));

router.get(
  "/tasks/dev",
  userAuth,
  projectController.getDevTasks.bind(projectController)
);

export default router;
