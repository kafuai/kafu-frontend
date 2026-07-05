import type {
  OperationalComplianceRecord,
  OperationalComplianceStatus,
} from "./operationalCompliance";

export interface OperationalComplianceChange {
  readonly recordId: string;
  readonly changedAt: string;
  readonly previousStatus: OperationalComplianceStatus;
  readonly nextStatus: OperationalComplianceStatus;
}

export function applyOperationalComplianceChange(
  record: OperationalComplianceRecord,
  change: OperationalComplianceChange,
): OperationalComplianceRecord {
  if (record.id !== change.recordId) {
    return record;
  }

  return {
    ...record,
    status: change.nextStatus,
    assessedAt: change.changedAt,
  };
}