import type {
  ExecutionSchedule,
  ExecutionScheduleStatus,
} from "./executionSchedule";

export interface CreateExecutionScheduleOptions {
  id: string;
  targetId: string;
  targetType: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  priority: "low" | "medium" | "high" | "critical";
  status?: ExecutionScheduleStatus;
}

export function createExecutionSchedule(
  options: CreateExecutionScheduleOptions,
): ExecutionSchedule {
  return {
    id: options.id,
    targetId: options.targetId,
    targetType: options.targetType,
    scheduledStartAt: options.scheduledStartAt,
    scheduledEndAt: options.scheduledEndAt,
    priority: options.priority,
    status: options.status ?? "planned",
  };
}