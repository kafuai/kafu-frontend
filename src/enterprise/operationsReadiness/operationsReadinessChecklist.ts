export type OperationsChecklistItemStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "blocked";

export interface OperationsChecklistItem {
  readonly id: string;
  readonly title: string;
  readonly owner: string;
  readonly status: OperationsChecklistItemStatus;
  readonly mandatory: boolean;
}

export interface OperationsReadinessChecklist {
  readonly id: string;
  readonly name: string;
  readonly items: readonly OperationsChecklistItem[];
}

export function calculateChecklistCompletion(
  checklist: OperationsReadinessChecklist,
): number {
  if (checklist.items.length === 0) {
    return 0;
  }

  const completed = checklist.items.filter(
    (item) => item.status === "completed",
  ).length;

  return Math.round((completed / checklist.items.length) * 100);
}

export function hasMandatoryBlockers(
  checklist: OperationsReadinessChecklist,
): boolean {
  return checklist.items.some(
    (item) => item.mandatory && item.status === "blocked",
  );
}