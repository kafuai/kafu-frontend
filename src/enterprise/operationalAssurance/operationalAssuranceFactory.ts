import {
  type OperationalAssuranceRecord,
  type OperationalAssuranceSeverity,
} from "./operationalAssurance";

export interface CreateOperationalAssuranceRecordInput {
  readonly id: string;
  readonly targetId: string;
  readonly severity: OperationalAssuranceSeverity;
}

export function createOperationalAssuranceRecord(
  input: CreateOperationalAssuranceRecordInput,
): OperationalAssuranceRecord {
  return {
    id: input.id,
    targetId: input.targetId,
    status: "pending",
    severity: input.severity,
    verifiedAt: new Date().toISOString(),
  };
}