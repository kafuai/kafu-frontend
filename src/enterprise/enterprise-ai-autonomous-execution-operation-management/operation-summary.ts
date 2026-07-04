import type { OperationRecord } from "./operation-record";

export interface OperationSummary {
  id: string;
  name: string;
  status: string;
  priority: string;
  riskLevel: string;
  ownerId?: string;
}

export function summarizeOperation(
  operation: OperationRecord
): OperationSummary {
  return {
    id: operation.id,
    name: operation.name,
    status: operation.status,
    priority: operation.priority,
    riskLevel: operation.riskLevel,
    ownerId: operation.ownerId,
  };
}