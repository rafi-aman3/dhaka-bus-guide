import { Request, Response } from "express";
import { StoppageService } from "../services/stoppage.service";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

export const StoppageController = {
  getAll: catchAsync(async (_req: Request, res: Response) => {
    logger.info("Fetching all stoppages");
    const stoppages = await StoppageService.getAll();
    logger.info(`Fetched ${stoppages.length} stoppages`);
    res.json({
      success: true,
      message: "Stoppages fetched successfully",
      data: stoppages,
    });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    logger.info({ id }, "Fetching stoppage by id");

    if (isNaN(id)) {
      logger.warn({ id: req.params.id }, "Invalid ID provided");
      throw new ApiError(400, "Invalid ID");
    }

    const stoppage = await StoppageService.getById(id);
    if (!stoppage) {
      logger.warn({ id }, "Stoppage not found");
      throw new ApiError(404, "Stoppage not found");
    }

    logger.info({ id }, "Stoppage fetched successfully");
    res.json({
      success: true,
      message: "Stoppage fetched successfully",
      data: stoppage,
    });
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    logger.info({ data: req.body }, "Creating new stoppage");
    const stoppage = await StoppageService.create(req.body);
    logger.info({ id: stoppage.id }, "Stoppage created successfully");
    res.status(201).json({
      success: true,
      message: "Stoppage created successfully",
      data: stoppage,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    logger.info({ id, data: req.body }, "Updating stoppage");

    if (isNaN(id)) {
      logger.warn({ id: req.params.id }, "Invalid ID provided");
      throw new ApiError(400, "Invalid ID");
    }

    const updated = await StoppageService.update(id, req.body);
    if (!updated) {
      logger.warn({ id }, "Stoppage not found for update");
      throw new ApiError(404, "Stoppage not found");
    }

    logger.info({ id }, "Stoppage updated successfully");
    res.json({
      success: true,
      message: "Stoppage updated successfully",
      data: updated,
    });
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    logger.info({ id }, "Deleting stoppage");

    if (isNaN(id)) {
      logger.warn({ id: req.params.id }, "Invalid ID provided");
      throw new ApiError(400, "Invalid ID");
    }

    const deleted = await StoppageService.delete(id);
    if (!deleted) {
      logger.warn({ id }, "Stoppage not found for deletion");
      throw new ApiError(404, "Stoppage not found");
    }

    logger.info({ id }, "Stoppage deleted successfully");
    res.status(200).json({
      success: true,
      message: "Stoppage deleted successfully",
    });
  }),
};
