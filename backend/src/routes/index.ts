import { Router } from "express";
import transcribe from "./v1/transcribe.routes.js";
import diagnose from "./v1/diagnose.routes.js";
import reports from "./v1/reports.routes.js";
import chat from "./v1/chat.routes.js";

const router = Router();

router.use(`/transcribe`, transcribe);
router.use(`/diagnose`, diagnose);
router.use(`/reports`, reports);
router.use("/chat", chat);

export default router;
