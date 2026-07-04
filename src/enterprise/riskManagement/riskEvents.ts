export type EnterpriseRiskEventType =
  | "identified"
  | "assessed"
  | "mitigationStarted"
  | "mitigationCompleted"
  | "thresholdExceeded"
  | "closed";

export interface EnterpriseRiskEvent {
  eventId: string;
  riskId: string;
  type: EnterpriseRiskEventType;
  timestamp: string;
  actor?: string;
  details?: Record<string, unknown>;
}