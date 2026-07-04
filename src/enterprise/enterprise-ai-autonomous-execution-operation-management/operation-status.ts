export type OperationStatus =
  | "planned"
  | "queued"
  | "running"
  | "blocked"
  | "completed"
  | "failed"
  | "cancelled";

export const OPERATION_STATUSES: OperationStatus[] = [
  "planned",
  "queued",
  "running",
  "blocked",
  "completed",
  "failed",
  "cancelled",
];

export function isTerminalOperationStatus(status: OperationStatus): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}

export function isActiveOperationStatus(status: OperationStatus): boolean {
  return status === "queued" || status === "running" || status === "blocked";
}