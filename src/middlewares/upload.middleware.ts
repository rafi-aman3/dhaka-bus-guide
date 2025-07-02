import multer from "multer";
import path from "path";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  logger.info("File filter called:", {
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
  });

  const ext = path.extname(file.originalname);
  logger.info(`File extension: ${ext}`);

  if (ext !== ".xlsx" && ext !== ".xls") {
    logger.error(`Invalid file extension: ${ext}`);
    return cb(
      new ApiError(400, "Only Excel files (.xlsx, .xls) are allowed"),
      false
    );
  }

  logger.info("File passed filter validation");
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Add a debug middleware to see what's happening
export const debugUpload = (req: any, res: any, next: any) => {
  logger.info("Before multer - req.file:", req.file);
  logger.info("Before multer - req.files:", req.files);
  next();
};

// Create a simple version without fileFilter for testing
export const uploadSimple = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
