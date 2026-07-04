export type ComplianceEventType =
  | "framework.created"
  | "assessment.completed"
  | "finding.created"
  | "finding.resolved"
  | "evidence.collected"
  | "remediation.completed";

export interface ComplianceEvent<T = unknown> {
  id: string;
  type: ComplianceEventType;
  timestamp: string;
  payload: T;
}

export function createComplianceEvent<T>(
  id: string,
  type: ComplianceEventType,
  payload: T,
): ComplianceEvent<T> {
  return {
    id,
    type,
    timestamp: new Date().toISOString(),
    payload,
  };
}