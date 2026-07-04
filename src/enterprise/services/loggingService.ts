import { EnterpriseServiceContract } from "./enterpriseServiceTypes";

export type LogLevel = "info" | "warn" | "error";

export type EnterpriseLogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
};

export class LoggingService implements EnterpriseServiceContract {
  readonly name = "logging-service";

  private readonly logs: EnterpriseLogEntry[] = [];

  log(level: LogLevel, message: string, context?: string): void {
    this.logs.push({
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  getLogs(): EnterpriseLogEntry[] {
    return this.logs;
  }

  healthCheck(): boolean {
    return true;
  }
}