import {
  AIExecutionCoordinationAuditMetadata,
  AIExecutionCoordinationPriority,
  AIExecutionCoordinationStatus,
} from "./aiAutonomousExecutionCoordinationTypes";

export interface AIExecutionCoordinationTask {
  id: string;
  title: string;
  description: string;
  ownerId?: string;
  requiredResourceIds: string[];
  dependencyTaskIds: string[];
  priority: AIExecutionCoordinationPriority;
  status: AIExecutionCoordinationStatus;
  estimatedEffort: number;
  plannedStartAt?: Date;
  plannedEndAt?: Date;
  metadata: AIExecutionCoordinationAuditMetadata;
}

export interface CreateAIExecutionCoordinationTaskInput {
  id: string;
  title: string;
  description: string;
  ownerId?: string;
  requiredResourceIds?: string[];
  dependencyTaskIds?: string[];
  priority?: AIExecutionCoordinationPriority;
  estimatedEffort?: number;
  plannedStartAt?: Date;
  plannedEndAt?: Date;
  metadata: AIExecutionCoordinationAuditMetadata;
}

export function createAIExecutionCoordinationTask(
  input: CreateAIExecutionCoordinationTaskInput,
): AIExecutionCoordinationTask {
  if (!input.id.trim()) {
    throw new Error("Execution coordination task id is required");
  }

  if (!input.title.trim()) {
    throw new Error("Execution coordination task title is required");
  }

  if (!input.description.trim()) {
    throw new Error("Execution coordination task description is required");
  }

  const estimatedEffort = input.estimatedEffort ?? 1;

  if (estimatedEffort <= 0) {
    throw new Error("Execution coordination task estimated effort must be greater than zero");
  }

  return {
    id: input.id,
    title: input.title,
    description: input.description,
    ownerId: input.ownerId,
    requiredResourceIds: input.requiredResourceIds ?? [],
    dependencyTaskIds: input.dependencyTaskIds ?? [],
    priority: input.priority ?? "medium",
    status: "waiting",
    estimatedEffort,
    plannedStartAt: input.plannedStartAt,
    plannedEndAt: input.plannedEndAt,
    metadata: input.metadata,
  };
}

export function markAIExecutionCoordinationTaskReady(
  task: AIExecutionCoordinationTask,
): AIExecutionCoordinationTask {
  return {
    ...task,
    status: "ready",
  };
}

export function markAIExecutionCoordinationTaskBlocked(
  task: AIExecutionCoordinationTask,
): AIExecutionCoordinationTask {
  return {
    ...task,
    status: "blocked",
  };
}