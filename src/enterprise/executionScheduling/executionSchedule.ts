export type ExecutionScheduleStatus =
  | "planned"
  | "scheduled"
  | "blocked"
  | "completed"
  | "cancelled";

export interface ExecutionSchedule {
  readonly id: string;
  readonly targetId: string;
  readonly targetType: string;
  readonly scheduledStartAt: string;
  readonly scheduledEndAt: string;
  readonly status: ExecutionScheduleStatus;
  readonly priority: "low" | "medium" | "high" | "critical";
}