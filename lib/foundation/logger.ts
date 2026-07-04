type LogLevel = "info" | "warn" | "error";

class FoundationLogger {
  private enabled = process.env.NODE_ENV !== "production";

  private write(level: LogLevel, message: string, data?: unknown) {
    if (!this.enabled) return;

    console[level](`[KAFU] ${message}`, data ?? "");
  }

  info(message: string, data?: unknown) {
    this.write("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.write("warn", message, data);
  }

  error(message: string, data?: unknown) {
    this.write("error", message, data);
  }
}

export const logger = new FoundationLogger();