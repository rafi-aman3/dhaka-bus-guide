import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const router = Router();

router.get("/status/:jobId", JobController.getJobStatus);
router.get("/", JobController.getAllJobs);

export default router;
