import { Worker, Job } from "bullmq";
import { redis } from "../config/redis";
import * as XLSX from "xlsx";
import prisma from "../prisma";
import logger from "../utils/logger";
import { StoppageService } from "../services/stoppage.service";
import { ApiError } from "../utils/apiError";

const stoppageWorker = new Worker(
  "stoppage-upload",
  async (job) => {
    let bufferBase64 = job.data.buffer;
    const fileName = job.data.fileName;

    const buffer = Buffer.from(bufferBase64, "base64");

    try {
      logger.info(`Processing job ${job.id}: ${fileName}`);
      logger.info(`Buffer size: ${buffer.length} bytes`);

      // Parse the Excel file
      const workbook = XLSX.read(buffer, { type: "buffer" });
      logger.info(`Workbook sheets: ${workbook.SheetNames.join(", ")}`);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      logger.info(`Parsed ${jsonData.length} rows from Excel file`);
      logger.info(`Sample data:`, jsonData.slice(0, 2)); // Log first 2 rows

      if (jsonData.length === 0) {
        throw new ApiError(404, "No Excel Data found");
      }

      // Debug: Check what the service receives
      logger.info("Calling StoppageService.bulkCreateFromExcel...");
      const createdCount = await StoppageService.bulkCreateFromExcel(jsonData);

      logger.info(
        `Successfully created ${createdCount} stoppages from ${fileName}`
      );

      return {
        success: true,
        message: `Successfully processed ${createdCount} stoppages`,
        createdCount,
        fileName,
      };
    } catch (error) {
      logger.error(`Error processing job ${job.id}:`, error);
      logger.error(`Error stack:`, error);
      throw new ApiError(404, "Error processing job");
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

// Event listeners for monitoring
stoppageWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed successfully`);
  logger.info(`Job result:`, job.returnvalue);
});

stoppageWorker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});

stoppageWorker.on("error", (err) => {
  logger.error("Worker error:", err);
});

stoppageWorker.on("ready", () => {
  logger.info("Stoppage worker is ready and waiting for jobs");
});
