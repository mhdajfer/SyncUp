import express from "express";
import { ProjectRepository } from "../../Infrastructure/Repositories";
import { ProjectUseCases } from "../../Application/Use-cases";
import { ProjectControllers } from "../Controllers";
import { checkSchema } from "express-validator";
import projectValidator from "../../Shared/validators/projectValidator";
import userAuth from "../Middlewares/userAuth";
import { CommentController } from "../Controllers";
import { CommentRepository } from "../../Infrastructure/Repositories";
import { CommentUseCases } from "../../Application/Use-cases";

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

router.get(
  "/forDev",
  userAuth,
  projectController.getAssignedProjectsForDev.bind(projectController)
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
