import { Router } from "express";
import { chatController } from "../../controllers/chat.controller.js";

const router = Router();

router.use("/", chatController);

export default router;
