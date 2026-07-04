import {
  AIExecutionCoordinationConflictSeverity,
  AIExecutionCoordinationConflictType,
} from "./aiAutonomousExecutionCoordinationTypes";
import { AIExecutionCoordinationTask } from "./aiExecutionCoordinationTask";

export interface AIExecutionCoordinationConflict {
  id: string;
  taskIds: string[];
  type: AIExecutionCoordinationConflictType;
  severity: AIExecutionCoordinationConflictSeverity;
  reason: string;
  detectedAt: Date;
}

export interface AIExecutionCoordinationConflictDetectionInput {
  tasks: AIExecutionCoordinationTask[];
  detectedAt?: Date;
}

export function detectAIExecutionCoordinationConflicts(
  input: AIExecutionCoordinationConflictDetectionInput,
): AIExecutionCoordinationConflict[] {
  return [
    ...detectResourceConflicts(input.tasks, input.detectedAt),
    ...detectTimingConflicts(input.tasks, input.detectedAt),
    ...detectDependencyConflicts(input.tasks, input.detectedAt),
  ];
}

function detectResourceConflicts(
  tasks: AIExecutionCoordinationTask[],
  detectedAt = new Date(),
): AIExecutionCoordinationConflict[] {
  const conflicts: AIExecutionCoordinationConflict[] = [];
  const resourceUsage = new Map<string, AIExecutionCoordinationTask[]>();

  for (const task of tasks) {
    for (const resourceId of task.requiredResourceIds) {
      const existing = resourceUsage.get(resourceId) ?? [];
      existing.push(task);
      resourceUsage.set(resourceId, existing);
    }
  }

  for (const [resourceId, resourceTasks] of resourceUsage.entries()) {
    if (resourceTasks.length <= 1) {
      continue;
    }

    conflicts.push({
      id: `resource-conflict-${resourceId}`,
      taskIds: resourceTasks.map((task) => task.id),
      type: "resource",
      severity: resourceTasks.length > 3 ? "high" : "medium",
      reason: `Resource ${resourceId} is required by multiple coordination tasks`,
      detectedAt,
    });
  }

  return conflicts;
}

function detectTimingConflicts(
  tasks: AIExecutionCoordinationTask[],
  detectedAt = new Date(),
): AIExecutionCoordinationConflict[] {
  const conflicts: AIExecutionCoordinationConflict[] = [];

  for (const task of tasks) {
    if (!task.plannedStartAt || !task.plannedEndAt) {
      continue;
    }

    if (task.plannedEndAt <= task.plannedStartAt) {
      conflicts.push({
        id: `timing-conflict-${task.id}`,
        taskIds: [task.id],
        type: "timing",
        severity: "high",
        reason: "Planned end time must be after planned start time",
        detectedAt,
      });
    }
  }

  return conflicts;
}

function detectDependencyConflicts(
  tasks: AIExecutionCoordinationTask[],
  detectedAt = new Date(),
): AIExecutionCoordinationConflict[] {
  const conflicts: AIExecutionCoordinationConflict[] = [];
  const taskIds = new Set(tasks.map((task) => task.id));

  for (const task of tasks) {
    const missingDependencyIds = task.dependencyTaskIds.filter(
      (dependencyTaskId) => !taskIds.has(dependencyTaskId),
    );

    if (missingDependencyIds.length === 0) {
      continue;
    }

    conflicts.push({
      id: `dependency-conflict-${task.id}`,
      taskIds: [task.id, ...missingDependencyIds],
      type: "dependency",
      severity: "critical",
      reason: `Task has missing dependencies: ${missingDependencyIds.join(", ")}`,
      detectedAt,
    });
  }

  return conflicts;
}