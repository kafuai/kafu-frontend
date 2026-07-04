import type { OperationRecord } from "./operation-record";
import type { OperationStatus } from "./operation-status";

export type OperationBoard = Record<OperationStatus, OperationRecord[]>;

export function createOperationBoard(
  operations: OperationRecord[]
): OperationBoard {
  return operations.reduce<OperationBoard>(
    (board, operation) => {
      board[operation.status].push(operation);
      return board;
    },
    {
      planned: [],
      queued: [],
      running: [],
      blocked: [],
      completed: [],
      failed: [],
      cancelled: [],
    }
  );
}