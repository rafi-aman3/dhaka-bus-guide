import express from "express";
import stoppagesRoutes from "./stoppage.routes";
const router = express.Router();

router.use("/stoppages", stoppagesRoutes);

export default router;
