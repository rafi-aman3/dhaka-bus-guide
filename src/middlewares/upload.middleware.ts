import multer from "multer";
import path from "path";
import { ApiError } from "../utils/apiError";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".xlsx" && ext !== ".xls") {
    return cb(
      new ApiError(400, "Only Excel files (.xlsx, .xls) are allowed"),
      false
    );
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
