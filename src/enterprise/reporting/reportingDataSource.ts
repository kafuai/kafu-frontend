export type ReportingDataSourceType = "database" | "api" | "event_stream" | "file" | "internal_module";

export interface ReportingDataSource {
  id: string;
  name: string;
  type: ReportingDataSourceType;
  endpoint?: string;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export function isReportingDataSourceEnabled(source: ReportingDataSource): boolean {
  return source.enabled;
}
