import express from "express";
import userAuth from "../Middlewares/userAuth";

const router = express.Router();
import { GroupChatRepository } from "../repositories/GroupChatRepository";
import { GroupChatUseCases } from "../use-cases/GroupChatUseCases";
import { GroupChatController } from "../Controllers/GroupChatController";

const groupChatRepository = new GroupChatRepository();
const groupChatUseCases = new GroupChatUseCases(groupChatRepository);
const groupChatController = new GroupChatController(groupChatUseCases);

router.post(
  "/",
  userAuth,
  groupChatController.createGroupChat.bind(groupChatController)
);
router.post(
  "/member/add",
  userAuth,
  groupChatController.addNewMemberToGroupChat.bind(groupChatController)
);

router.post(
  "/member/remove",
  userAuth,
  groupChatController.removeMember.bind(groupChatController)
);

export default router;
