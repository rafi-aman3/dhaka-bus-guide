import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const stoppageQueue = new Queue("stoppage-upload", {
  connection: redis,
});
