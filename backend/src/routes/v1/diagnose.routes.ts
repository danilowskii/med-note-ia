import { Router } from "express";
import { diagnoseController } from "../../controllers/diagnose.controller.js";

const router = Router();

router.post("/", diagnoseController);

export default router;
