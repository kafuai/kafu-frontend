import type { OperationPriority } from "./operation-priority";
import type { OperationRecord } from "./operation-record";
import type { OperationRiskLevel } from "./operation-risk-level";
import type { OperationStatus } from "./operation-status";

export interface OperationSelector {
  tenantId?: string;
  actionId?: string;
  status?: OperationStatus;
  priority?: OperationPriority;
  riskLevel?: OperationRiskLevel;
  ownerId?: string;
}

export function selectOperations(
  operations: OperationRecord[],
  selector: OperationSelector
): OperationRecord[] {
  return operations.filter((operation) => {
    if (selector.tenantId && operation.tenantId !== selector.tenantId) {
      return false;
    }

    if (selector.actionId && operation.actionId !== selector.actionId) {
      return false;
    }

    if (selector.status && operation.status !== selector.status) {
      return false;
    }

    if (selector.priority && operation.priority !== selector.priority) {
      return false;
    }

    if (selector.riskLevel && operation.riskLevel !== selector.riskLevel) {
      return false;
    }

    if (selector.ownerId && operation.ownerId !== selector.ownerId) {
      return false;
    }

    return true;
  });
}