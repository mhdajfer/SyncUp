import express from "express";
const router = express.Router();
import chatRoutes from "./chatRoutes";
import groupChatRoutes from "./groupChatRoutes";

router.use("/group", groupChatRoutes);
router.use("/", chatRoutes);

export default router;
