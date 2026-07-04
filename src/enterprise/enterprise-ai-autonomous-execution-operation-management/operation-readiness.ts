import type { OperationRecord } from "./operation-record";

export interface OperationReadiness {
  ready: boolean;
  score: number;
}

export function evaluateOperationReadiness(
  operation: OperationRecord
): OperationReadiness {
  let score = 0;

  if (operation.name) score += 25;
  if (operation.description) score += 20;
  if (operation.ownerId) score += 20;
  if (operation.priority) score += 15;
  if (operation.actionId) score += 20;

  return {
    ready: score >= 80,
    score,
  };
}