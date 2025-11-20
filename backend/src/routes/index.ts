import { Router } from "express";
import transcribe from "./v1/transcribe.routes.js";
import diagnose from "./v1/diagnose.routes.js";
import reports from "./v1/reports.routes.js";

const router = Router();

router.use("/v1/transcribe", transcribe);
router.use("/v1/diagnose", diagnose);
router.use("/v1/reports", reports);

export default router;
