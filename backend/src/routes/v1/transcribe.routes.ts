import { Router } from "express";
import {
  transcribeController,
  uploadAudioMiddleware,
} from "../../controllers/transcribe.controller.js";

const router = Router();

router.post("/", uploadAudioMiddleware, transcribeController);

export default router;
