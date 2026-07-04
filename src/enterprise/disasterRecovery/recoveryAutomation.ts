export type RecoveryAutomationStepType =
  | "restore-backup"
  | "switch-traffic"
  | "scale-capacity"
  | "validate-service"
  | "notify-stakeholders"
  | "custom";

export type RecoveryAutomationStep = {
  id: string;
  name: string;
  type: RecoveryAutomationStepType;
  order: number;
  required: boolean;
};

export type RecoveryAutomationRun = {
  id: string;
  planId: string;
  steps: RecoveryAutomationStep[];
  startedAt: string;
  completedSteps: string[];
  failedSteps: string[];
};

function createRecoveryAutomationRunId(): string {
  return `recovery_auto_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createRecoveryAutomationRun(
  planId: string,
  steps: RecoveryAutomationStep[],
): RecoveryAutomationRun {
  return {
    id: createRecoveryAutomationRunId(),
    planId,
    steps: [...steps].sort((a, b) => a.order - b.order),
    startedAt: new Date().toISOString(),
    completedSteps: [],
    failedSteps: [],
  };
}

export function markRecoveryStepCompleted(
  run: RecoveryAutomationRun,
  stepId: string,
): RecoveryAutomationRun {
  return {
    ...run,
    completedSteps: Array.from(new Set([...run.completedSteps, stepId])),
    failedSteps: run.failedSteps.filter((id) => id !== stepId),
  };
}

export function markRecoveryStepFailed(
  run: RecoveryAutomationRun,
  stepId: string,
): RecoveryAutomationRun {
  return {
    ...run,
    failedSteps: Array.from(new Set([...run.failedSteps, stepId])),
  };
}

export function isRecoveryAutomationComplete(
  run: RecoveryAutomationRun,
): boolean {
  const requiredStepIds = run.steps
    .filter((step) => step.required)
    .map((step) => step.id);

  return requiredStepIds.every((stepId) =>
    run.completedSteps.includes(stepId),
  );
}