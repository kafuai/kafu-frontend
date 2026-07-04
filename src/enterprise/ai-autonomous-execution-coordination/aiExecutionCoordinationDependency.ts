import {
  AIExecutionCoordinationDependencyState,
  AIExecutionCoordinationReadiness,
} from "./aiAutonomousExecutionCoordinationTypes";
import { AIExecutionCoordinationTask } from "./aiExecutionCoordinationTask";

export interface AIExecutionCoordinationDependencyResult {
  taskId: string;
  state: AIExecutionCoordinationDependencyState;
  satisfiedDependencyIds: string[];
  waitingDependencyIds: string[];
  missingDependencyIds: string[];
  readiness: AIExecutionCoordinationReadiness;
}

export function resolveAIExecutionCoordinationDependencies(
  task: AIExecutionCoordinationTask,
  allTasks: AIExecutionCoordinationTask[],
): AIExecutionCoordinationDependencyResult {
  const taskById = new Map(allTasks.map((candidate) => [candidate.id, candidate]));

  const satisfiedDependencyIds: string[] = [];
  const waitingDependencyIds: string[] = [];
  const missingDependencyIds: string[] = [];

  for (const dependencyTaskId of task.dependencyTaskIds) {
    const dependencyTask = taskById.get(dependencyTaskId);

    if (!dependencyTask) {
      missingDependencyIds.push(dependencyTaskId);
      continue;
    }

    if (dependencyTask.status === "coordinated" || dependencyTask.status === "ready") {
      satisfiedDependencyIds.push(dependencyTaskId);
      continue;
    }

    waitingDependencyIds.push(dependencyTaskId);
  }

  const totalDependencies = task.dependencyTaskIds.length;
  const blockingCount = waitingDependencyIds.length + missingDependencyIds.length;
  const score =
    totalDependencies === 0 ? 1 : satisfiedDependencyIds.length / totalDependencies;

  const isReady = blockingCount === 0;

  return {
    taskId: task.id,
    state: getDependencyState(waitingDependencyIds.length, missingDependencyIds.length),
    satisfiedDependencyIds,
    waitingDependencyIds,
    missingDependencyIds,
    readiness: {
      isReady,
      score,
      reasons: buildDependencyReadinessReasons(waitingDependencyIds, missingDependencyIds),
    },
  };
}

function getDependencyState(
  waitingCount: number,
  missingCount: number,
): AIExecutionCoordinationDependencyState {
  if (missingCount > 0) {
    return "missing";
  }

  if (waitingCount > 0) {
    return "waiting";
  }

  return "satisfied";
}

function buildDependencyReadinessReasons(
  waitingDependencyIds: string[],
  missingDependencyIds: string[],
): string[] {
  const reasons: string[] = [];

  if (waitingDependencyIds.length > 0) {
    reasons.push(`Waiting dependencies: ${waitingDependencyIds.join(", ")}`);
  }

  if (missingDependencyIds.length > 0) {
    reasons.push(`Missing dependencies: ${missingDependencyIds.join(", ")}`);
  }

  if (reasons.length === 0) {
    reasons.push("All dependencies satisfied");
  }

  return reasons;
}