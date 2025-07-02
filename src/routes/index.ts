import express from "express";
import stoppagesRoutes from "./stoppage.routes";
import jobsRoutes from "./job.routes";
const router = express.Router();

router.use("/stoppages", stoppagesRoutes);
router.use("/jobs", jobsRoutes);

export default router;
