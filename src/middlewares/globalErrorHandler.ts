import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";
import { MulterError } from "multer";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err); // Log the full error stack

  // Handle Multer errors
  if (err instanceof MulterError) {
    res.status(400).json({
      success: false,
      message: err.message || "File upload error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Handle custom API errors
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
