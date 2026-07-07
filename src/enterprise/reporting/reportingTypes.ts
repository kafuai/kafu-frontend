export type ReportingFormat = "json" | "csv" | "pdf" | "html";

export type ReportingStatus = "draft" | "active" | "paused" | "archived";

export type ReportingFrequency = "manual" | "daily" | "weekly" | "monthly";

export interface ReportingContext {
  organizationId: string;
  requestedBy: string;
  requestedAt: string;
}

export interface ReportingResult<T = unknown> {
  reportId: string;
  status: "success" | "failed";
  generatedAt: string;
  format: ReportingFormat;
  payload: T;
  errors?: string[];
}
