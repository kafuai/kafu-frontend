export type CustomerSuccessTaskStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "blocked";

export interface CustomerSuccessTask {
  id: string;
  accountId: string;
  title: string;
  status: CustomerSuccessTaskStatus;
  ownerId: string;
  dueDate?: Date;
}

export function completeSuccessTask(
  task: CustomerSuccessTask,
): CustomerSuccessTask {
  return {
    ...task,
    status: "completed",
  };
}