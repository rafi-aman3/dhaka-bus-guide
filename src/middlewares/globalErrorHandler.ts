import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

export const globalErrorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err); // Log the full error stack

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
