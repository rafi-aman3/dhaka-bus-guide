import pino from "pino";
const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  transport: isProd
    ? undefined // plain JSON output in prod
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
});

export default logger;
