export type OperationPriority = "low" | "medium" | "high" | "critical";

export const OPERATION_PRIORITIES: OperationPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export function getOperationPriorityWeight(priority: OperationPriority): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}