import {
  AIExecutionCoordinationPriority,
  AIExecutionCoordinationReadiness,
} from "./aiAutonomousExecutionCoordinationTypes";
import {
  AIExecutionCoordinationConflict,
  detectAIExecutionCoordinationConflicts,
} from "./aiExecutionCoordinationConflict";
import {
  AIExecutionCoordinationDependencyResult,
  resolveAIExecutionCoordinationDependencies,
} from "./aiExecutionCoordinationDependency";
import {
  AIExecutionCoordinationTask,
  markAIExecutionCoordinationTaskBlocked,
  markAIExecutionCoordinationTaskReady,
} from "./aiExecutionCoordinationTask";

export interface AIExecutionCoordinationPlan {
  id: string;
  createdAt: Date;
  createdBy: string;
  tasks: AIExecutionCoordinationTask[];
  readyTasks: AIExecutionCoordinationTask[];
  blockedTasks: AIExecutionCoordinationTask[];
  conflictedTasks: AIExecutionCoordinationTask[];
  dependencyResults: AIExecutionCoordinationDependencyResult[];
  conflicts: AIExecutionCoordinationConflict[];
  readiness: AIExecutionCoordinationReadiness;
}

export interface CreateAIExecutionCoordinationPlanInput {
  id: string;
  createdBy: string;
  tasks: AIExecutionCoordinationTask[];
  createdAt?: Date;
}

export function createAIExecutionCoordinationPlan(
  input: CreateAIExecutionCoordinationPlanInput,
): AIExecutionCoordinationPlan {
  if (!input.id.trim()) {
    throw new Error("Execution coordination plan id is required");
  }

  if (!input.createdBy.trim()) {
    throw new Error("Execution coordination plan creator is required");
  }

  const conflicts = detectAIExecutionCoordinationConflicts({
    tasks: input.tasks,
    detectedAt: input.createdAt,
  });

  const conflictedTaskIds = new Set(conflicts.flatMap((conflict) => conflict.taskIds));

  const dependencyResults = input.tasks.map((task) =>
    resolveAIExecutionCoordinationDependencies(task, input.tasks),
  );

  const dependencyResultByTaskId = new Map(
    dependencyResults.map((result) => [result.taskId, result]),
  );

  const readyTasks: AIExecutionCoordinationTask[] = [];
  const blockedTasks: AIExecutionCoordinationTask[] = [];
  const conflictedTasks: AIExecutionCoordinationTask[] = [];

  for (const task of sortAIExecutionCoordinationTasks(input.tasks)) {
    const dependencyResult = dependencyResultByTaskId.get(task.id);
    const hasConflict = conflictedTaskIds.has(task.id);

    if (hasConflict) {
      conflictedTasks.push({
        ...task,
        status: "conflicted",
      });
      continue;
    }

    if (!dependencyResult?.readiness.isReady) {
      blockedTasks.push(markAIExecutionCoordinationTaskBlocked(task));
      continue;
    }

    readyTasks.push(markAIExecutionCoordinationTaskReady(task));
  }

  return {
    id: input.id,
    createdAt: input.createdAt ?? new Date(),
    createdBy: input.createdBy,
    tasks: sortAIExecutionCoordinationTasks(input.tasks),
    readyTasks,
    blockedTasks,
    conflictedTasks,
    dependencyResults,
    conflicts,
    readiness: calculatePlanReadiness(
      input.tasks.length,
      readyTasks.length,
      blockedTasks.length,
      conflictedTasks.length,
    ),
  };
}

function sortAIExecutionCoordinationTasks(
  tasks: AIExecutionCoordinationTask[],
): AIExecutionCoordinationTask[] {
  return [...tasks].sort((left, right) => {
    const priorityDifference =
      getPriorityWeight(right.priority) - getPriorityWeight(left.priority);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return left.estimatedEffort - right.estimatedEffort;
  });
}

function getPriorityWeight(priority: AIExecutionCoordinationPriority): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function calculatePlanReadiness(
  totalTasks: number,
  readyCount: number,
  blockedCount: number,
  conflictedCount: number,
): AIExecutionCoordinationReadiness {
  if (totalTasks === 0) {
    return {
      isReady: false,
      score: 0,
      reasons: ["No coordination tasks available"],
    };
  }

  const score = readyCount / totalTasks;
  const reasons: string[] = [];

  if (readyCount > 0) {
    reasons.push(`Ready tasks: ${readyCount}`);
  }

  if (blockedCount > 0) {
    reasons.push(`Blocked tasks: ${blockedCount}`);
  }

  if (conflictedCount > 0) {
    reasons.push(`Conflicted tasks: ${conflictedCount}`);
  }

  return {
    isReady: blockedCount === 0 && conflictedCount === 0,
    score,
    reasons,
  };
}