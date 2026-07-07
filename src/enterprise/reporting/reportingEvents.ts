export type ReportingEventType =
  | "report.created"
  | "report.generated"
  | "report.delivered"
  | "report.failed";

export interface ReportingEvent {
  id: string;
  type: ReportingEventType;
  reportId: string;
  occurredAt: string;
  payload?: Record<string, unknown>;
}

export function createReportingEvent(
  event: Omit<ReportingEvent, "occurredAt">,
): ReportingEvent {
  return {
    ...event,
    occurredAt: new Date().toISOString(),
  };
}
