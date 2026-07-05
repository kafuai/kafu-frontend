export interface WorkQueueAssignment {
  readonly queueId: string;
  readonly itemId: string;
  readonly assignee: string;
  readonly assignedAt: string;
}

export function createWorkQueueAssignment(
  queueId: string,
  itemId: string,
  assignee: string,
): WorkQueueAssignment {
  return {
    queueId,
    itemId,
    assignee,
    assignedAt: new Date().toISOString(),
  };
}