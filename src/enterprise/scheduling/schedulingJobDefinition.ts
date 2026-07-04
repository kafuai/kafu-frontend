import {
  SchedulingJobDefinition,
  SchedulingJobPriority,
  SchedulingJobStatus,
  SchedulingJobTrigger,
} from "./schedulingTypes";

export type CreateSchedulingJobDefinitionInput = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  trigger: SchedulingJobTrigger;
  queueName: string;
  priority?: SchedulingJobPriority;
  status?: SchedulingJobStatus;
  maxRetries?: number;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
};

export function createSchedulingJobDefinition(
  input: CreateSchedulingJobDefinitionInput,
): SchedulingJobDefinition {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    trigger: input.trigger,
    queueName: input.queueName,
    priority: input.priority ?? "normal",
    status: input.status ?? "draft",
    maxRetries: input.maxRetries ?? 3,
    timeoutMs: input.timeoutMs,
    metadata: input.metadata,
    createdAt: now,
    updatedAt: now,
  };
}

export function activateSchedulingJob(
  job: SchedulingJobDefinition,
): SchedulingJobDefinition {
  return {
    ...job,
    status: "active",
    updatedAt: new Date(),
  };
}

export function pauseSchedulingJob(
  job: SchedulingJobDefinition,
): SchedulingJobDefinition {
  return {
    ...job,
    status: "paused",
    updatedAt: new Date(),
  };
}