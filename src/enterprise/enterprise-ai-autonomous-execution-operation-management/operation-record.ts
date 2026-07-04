import type { OperationPriority } from "./operation-priority";
import type { OperationRiskLevel } from "./operation-risk-level";
import type { OperationStatus } from "./operation-status";

export interface OperationRecord {
  id: string;
  tenantId: string;
  actionId: string;
  name: string;
  description: string;
  status: OperationStatus;
  priority: OperationPriority;
  riskLevel: OperationRiskLevel;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  blockedReason?: string;
  metadata?: Record<string, unknown>;
}

export function createOperationRecord(input: {
  id: string;
  tenantId: string;
  actionId: string;
  name: string;
  description: string;
  priority: OperationPriority;
  riskLevel?: OperationRiskLevel;
  ownerId?: string;
  metadata?: Record<string, unknown>;
  now?: string;
}): OperationRecord {
  const now = input.now ?? new Date().toISOString();

  return {
    id: input.id,
    tenantId: input.tenantId,
    actionId: input.actionId,
    name: input.name,
    description: input.description,
    status: "planned",
    priority: input.priority,
    riskLevel: input.riskLevel ?? "none",
    ownerId: input.ownerId,
    createdAt: now,
    updatedAt: now,
    metadata: input.metadata,
  };
}