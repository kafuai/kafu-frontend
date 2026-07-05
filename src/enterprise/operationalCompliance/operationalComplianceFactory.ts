import {
  type OperationalComplianceRecord,
  type OperationalComplianceSeverity,
} from "./operationalCompliance";

export interface CreateOperationalComplianceRecordInput {
  readonly id: string;
  readonly targetId: string;
  readonly framework: string;
  readonly severity: OperationalComplianceSeverity;
}

export function createOperationalComplianceRecord(
  input: CreateOperationalComplianceRecordInput,
): OperationalComplianceRecord {
  return {
    id: input.id,
    targetId: input.targetId,
    framework: input.framework,
    status: "under_review",
    severity: input.severity,
    assessedAt: new Date().toISOString(),
  };
}