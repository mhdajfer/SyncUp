import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "logs/requests-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
    }),
  ],
});

// Optional: Export a logger function to log manually if needed
export const logInfo = (message: string) => logger.info(message);
export const logError = (message: string) => logger.error(message);
