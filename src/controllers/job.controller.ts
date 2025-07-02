import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/apiError";
import { stoppageQueue } from "../jobs/stoppage.queue";

export const JobController = {
  getJobStatus: catchAsync(async (req: Request, res: Response) => {
    const jobId = req.params.jobId;

    const job = await stoppageQueue.getJob(jobId);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    const state = await job.getState();

    res.json({
      success: true,
      data: {
        id: job.id,
        state,
        progress: job.progress,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        failedReason: job.failedReason,
        returnvalue: job.returnvalue,
        data: job.data,
      },
    });
  }),
  getAllJobs: catchAsync(async (_req: Request, res: Response) => {
    const waiting = await stoppageQueue.getJobs(["waiting"]);
    const active = await stoppageQueue.getJobs(["active"]);
    const completed = await stoppageQueue.getJobs(["completed"]);
    const failed = await stoppageQueue.getJobs(["failed"]);

    res.json({
      success: true,
      data: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        jobs: {
          waiting: waiting.map((j) => ({ id: j.id, name: j.name })),
          active: active.map((j) => ({ id: j.id, name: j.name })),
          completed: completed.map((j) => ({
            id: j.id,
            name: j.name,
            returnvalue: j.returnvalue,
          })),
          failed: failed.map((j) => ({
            id: j.id,
            name: j.name,
            failedReason: j.failedReason,
          })),
        },
      },
    });
  }),
};
