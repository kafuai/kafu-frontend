import type { OperationStatus } from "./operation-status";

export interface OperationHistoryEntry {
  id: string;
  operationId: string;
  fromStatus?: OperationStatus;
  toStatus: OperationStatus;
  reason?: string;
  actorId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export function createOperationHistoryEntry(input: {
  id: string;
  operationId: string;
  fromStatus?: OperationStatus;
  toStatus: OperationStatus;
  reason?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
  now?: string;
}): OperationHistoryEntry {
  return {
    id: input.id,
    operationId: input.operationId,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    reason: input.reason,
    actorId: input.actorId,
    metadata: input.metadata,
    createdAt: input.now ?? new Date().toISOString(),
  };
}