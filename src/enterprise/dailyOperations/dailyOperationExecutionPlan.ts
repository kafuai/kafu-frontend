import type { DailyOperation } from "./dailyOperation";

export interface DailyOperationExecutionStep {
  readonly stepId: string;
  readonly operationId: string;
  readonly order: number;
  readonly name: string;
  readonly expectedOutcome: string;
  readonly requiredInputs: readonly string[];
}

export interface DailyOperationExecutionPlan {
  readonly planId: string;
  readonly generatedAt: string;
  readonly operations: readonly DailyOperation[];
  readonly steps: readonly DailyOperationExecutionStep[];
  readonly totalEstimatedMinutes: number;
}

export function createDailyOperationExecutionPlan(
  planId: string,
  operations: readonly DailyOperation[],
): DailyOperationExecutionPlan {
  const steps: DailyOperationExecutionStep[] = operations.map((operation, index) => ({
    stepId: `${planId}-step-${index + 1}`,
    operationId: operation.id,
    order: index + 1,
    name: `Execute ${operation.name}`,
    expectedOutcome: operation.description,
    requiredInputs: operation.dependencies.map((dependency) => dependency.operationId),
  }));

  return {
    planId,
    generatedAt: new Date().toISOString(),
    operations,
    steps,
    totalEstimatedMinutes: operations.reduce(
      (total, operation) => total + operation.estimatedMinutes,
      0,
    ),
  };
}