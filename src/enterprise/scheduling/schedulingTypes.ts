export type SchedulingJobStatus =
  | "draft"
  | "active"
  | "paused"
  | "disabled"
  | "failed";

export type SchedulingExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "retrying";

export type SchedulingJobTrigger =
  | "manual"
  | "cron"
  | "recurring"
  | "event"
  | "system";

export type SchedulingJobPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type SchedulingJobDefinition = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: SchedulingJobStatus;
  trigger: SchedulingJobTrigger;
  priority: SchedulingJobPriority;
  queueName: string;
  maxRetries: number;
  timeoutMs?: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
};

export type SchedulingJobPayload = {
  jobId: string;
  organizationId: string;
  data?: Record<string, unknown>;
};

export type SchedulingExecutionResult = {
  executionId: string;
  jobId: string;
  status: SchedulingExecutionStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  attempts: number;
};