import { logger } from "./logger";

export class FoundationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "FoundationError";
  }
}

export function handleError(error: unknown, context?: string) {
  if (error instanceof Error) {
    logger.error(context ?? error.name, {
      message: error.message,
      stack: error.stack,
    });
    return;
  }

  logger.error(context ?? "Unknown Error", error);
}