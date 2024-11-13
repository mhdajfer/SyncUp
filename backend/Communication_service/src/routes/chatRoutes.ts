import express from "express";
import { ChatRepository } from "../repositories/ChatRepository";
import { ChateUseCases } from "../use-cases/ChatUseCases";
import { ChatController } from "../Controllers/ChatController";
import userAuth from "../Middlewares/userAuth";

const router = express.Router();

const chatRepository = new ChatRepository();
const chatUseCases = new ChateUseCases(chatRepository);
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

export default router;
