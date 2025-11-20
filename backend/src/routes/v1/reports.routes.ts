import { Router } from "express";
import { getReportsController } from "../../controllers/reports.controller.js";

const router = Router();

router.get("/", getReportsController);

export default router;
