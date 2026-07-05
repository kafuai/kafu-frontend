import type { ExecutionCoordinator } from "./executionCoordinator";
import type { ExecutionDependency } from "./executionDependency";

export interface ExecutionCoordinationPlan {
  readonly id: string;
  readonly generatedAt: string;
  readonly coordinators: readonly ExecutionCoordinator[];
  readonly dependencies: readonly ExecutionDependency[];
  readonly executable: boolean;
}

export function createExecutionCoordinationPlan(
  id: string,
  coordinators: readonly ExecutionCoordinator[],
  dependencies: readonly ExecutionDependency[],
): ExecutionCoordinationPlan {
  return {
    id,
    generatedAt: new Date().toISOString(),
    coordinators,
    dependencies,
    executable: dependencies.every(
      (dependency) => dependency.requiredStatus === "satisfied",
    ),
  };
}