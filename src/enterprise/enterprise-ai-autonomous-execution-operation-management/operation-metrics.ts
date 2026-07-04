import type { OperationRecord } from "./operation-record";
import { isTerminalOperationStatus } from "./operation-status";

export interface OperationMetrics {
  total: number;
  active: number;
  terminal: number;
  blocked: number;
  completionRate: number;
}

export function calculateOperationMetrics(
  operations: OperationRecord[]
): OperationMetrics {
  const total = operations.length;
  const terminal = operations.filter((operation) =>
    isTerminalOperationStatus(operation.status)
  ).length;
  const blocked = operations.filter(
    (operation) => operation.status === "blocked"
  ).length;
  const active = operations.filter(
    (operation) => !isTerminalOperationStatus(operation.status)
  ).length;

  return {
    total,
    active,
    terminal,
    blocked,
    completionRate:
      total === 0
        ? 0
        : operations.filter((operation) => operation.status === "completed")
            .length / total,
  };
}