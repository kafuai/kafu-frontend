import type { OperationRecord } from "./operation-record";
import type { OperationStatus } from "./operation-status";

export function transitionOperation(
  operation: OperationRecord,
  status: OperationStatus,
  now: string = new Date().toISOString()
): OperationRecord {
  return {
    ...operation,
    status,
    updatedAt: now,
    startedAt:
      status === "running"
        ? operation.startedAt ?? now
        : operation.startedAt,
    completedAt:
      status === "completed" ||
      status === "failed" ||
      status === "cancelled"
        ? operation.completedAt ?? now
        : operation.completedAt,
  };
}