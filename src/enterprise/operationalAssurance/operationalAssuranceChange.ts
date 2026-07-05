import type {
  OperationalAssuranceRecord,
  OperationalAssuranceStatus,
} from "./operationalAssurance";

export interface OperationalAssuranceChange {
  readonly recordId: string;
  readonly changedAt: string;
  readonly previousStatus: OperationalAssuranceStatus;
  readonly nextStatus: OperationalAssuranceStatus;
}

export function applyOperationalAssuranceChange(
  record: OperationalAssuranceRecord,
  change: OperationalAssuranceChange,
): OperationalAssuranceRecord {
  if (record.id !== change.recordId) {
    return record;
  }

  return {
    ...record,
    status: change.nextStatus,
    verifiedAt: change.changedAt,
  };
}