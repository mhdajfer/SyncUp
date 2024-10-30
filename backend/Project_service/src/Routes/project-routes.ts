import express from "express";
import { ProjectRepository } from "../Repositories/ProjectRepository";
import { ProjectUseCases } from "../Use-cases/ProjectUseCases";
import { ProjectControllers } from "../Controllers/ProjectControllers";
import { checkSchema } from "express-validator";
import projectValidator from "../validators/projectValidator";
import userAuth from "../Middlewares/userAuth";
import { CommentController } from "../Controllers/CommentController";
import { CommentRepository } from "../Repositories/CommentRepository";
import { CommentUseCases } from "../Use-cases/CommentUseCases";

const router = express.Router();

const projectRepository = new ProjectRepository();
const projectUseCases = new ProjectUseCases(projectRepository);
const projectController = new ProjectControllers(projectUseCases);

const commentRepository = new CommentRepository();
const commentUseCases = new CommentUseCases(commentRepository);
const commentController = new CommentController(commentUseCases);

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

router.post(
  "/team/add",
  userAuth,
  projectController.AddTeamMember.bind(projectController)
);

router.post(
  "/team/remove",
  userAuth,
  projectController.removeTeamMember.bind(projectController)
);

router.post(
  "/comment/add",
  userAuth,
  commentController.addComment.bind(commentController)
);

export default router;
