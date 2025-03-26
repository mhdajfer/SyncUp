import express from "express";
import { ChatRepository } from "../../Infrastructure/repositories";
import { ChatUseCases } from "../../Application/use-cases";
import { ChatController } from "../Controllers";
import userAuth from "../Middlewares/userAuth";

const router = express.Router();

const chatRepository = new ChatRepository();
const chatUseCases = new ChatUseCases(chatRepository);
const chatController = new ChatController(chatUseCases);

router.get("/", chatController.getAllUsers.bind(chatController));

router.post(
  "/getChat",
  userAuth,
  chatController.getOneChat.bind(chatController)
);

router.get(
  "/allChat",
  userAuth,
  chatController.getAllChats.bind(chatController)
);

router.post(
  "/sendMessage",
  userAuth,
  chatController.sendMessage.bind(chatController)
);

router.post(
  "/getMessages",
  userAuth,
  chatController.getMessages.bind(chatController)
);

router.post(
  "/createCall",
  userAuth,
  chatController.createCallRecord.bind(chatController)
);

router.get(
  "/getHistory",
  userAuth,
  chatController.getCallRecords.bind(chatController)
);

router.get(
  "/updateStatus",
  userAuth,
  chatController.updateCallRecord.bind(chatController)
);

export default router;
