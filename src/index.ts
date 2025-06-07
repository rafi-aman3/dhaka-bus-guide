import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes";
import { ApiError } from "./utils/apiError";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import logger from "./utils/logger";
dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1", router);

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`🚀 Server running on port ${port}`);
});
